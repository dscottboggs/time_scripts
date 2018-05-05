#!/usr/bin/env python3.6
"""Record statistics on execution time a folder full of executables."""
from timeit import timeit
from subprocess import run, PIPE, CompletedProcess
from typing import Optional, Dict, List
from json import loads, dumps
from os import listdir, access
from os.path import basename, join
from os import X_OK as as_executable_file
from strict_hint import strict
from logging import getLogger, DEBUG
from logging.config import dictConfig


class TimeCommands:
    """TimeCommands in a specified folder."""

    @strict
    def __init__(self,
                 parent_dir: str,
                 iterations: int = 1000,
                 rate_limited: List[str] = []
            ):
        """The main entrypoint of the script."""
        # Logging config and initialization.
        dictConfig({
            "version": 1,
            "formatters": {
                "brief": {
                    'format':
                        "%(levelname)s [%(asctime)s] %(filename)s@%(lineno)s:"
                        + " %(message)s"
                },
                "friendly": {
                    'format':
                        "In %(filename)s, at line %(lineno)s, a message was"
                        + " logged. Message follows:\n\t%(message)s\nThis"
                        + " message was logged by the function %(funcName)s,"
                        + " with\n%(levelname)s(%(levelno)s) severity,"
                        + " at %(asctime)s."
                }
            },
            "handlers": {
                "testhandler": {
                    "class": "logging.StreamHandler",
                    "formatter": "brief",
                    "level": DEBUG
                }
            },
            "root": {
                "handlers": ["testhandler"],
                "level": DEBUG
            }
        })
        self.log = getLogger()
        self.parent_dir = parent_dir
        self.iterations = iterations
        self.rate_limited_commands = rate_limited
        self.rate_limited_iterations = 3
        self.times = self.get_existing_stats()
        self.baseline('before')
        self.time_all()
        self.baseline('after')
        self.write_results()

    def write_results(self):
        """Write the results of the tests to stats.json for later review."""
        with open('stats.json', mode='w') as stats:
            stats.write(dumps(self.times, indent=2) + '\n')

    @strict
    def baseline(self, prefix: str):
        """A baseline amount of time running any command will take."""
        if f'baseline {prefix}' in self.times.keys():
            self.times[f'baseline {prefix}'].append(self.timecmd("true"))
        else:
            self.times[f'baseline {prefix}'] = [self.timecmd("true")]

    @strict
    def add_new_time_for(self, command: str, time: float):
        """Check for the command in the times dict and append time to it."""
        self.log.info(f"Storing time {time} for command {command}.")
        if command in self.times.keys():
            self.times[command].append(time)
        else:
            self.times[command] = [time]

    def time_all(self):
        """Run timecmd() on each command in self.parent_dir."""
        for fn in listdir(self.parent_dir):
            self.log.debug(f"Checking file {fn}...")
            if access(join(self.parent_dir, fn), as_executable_file):
                self.log.info(
                    f"...{fn} is executable\nTiming command {fn}."
                )
                if fn == "iface":
                    self.add_new_time_for(
                        'iface',
                        self.timecmd(
                            "BLOCK_INSTANCE=enp4s9"
                            + join(self.parent_dir, fn)
                        )
                    )
                # NOTE: Any scripts which require params or envvars should
                # intercept here
                if fn in self.rate_limited_commands:
                    self.add_new_time_for(
                        fn,
                        self.timecmd(
                            join(self.parent_dir, fn),
                            self.rate_limited_iterations
                        )
                    )
                else:
                    self.add_new_time_for(
                        fn, self.timecmd(join(self.parent_dir, fn))
                    )
            else:
                self.log.info(f"...{fn} is not executable. Skipping.")

    @strict
    def timecmd(self, cmd: str, number_of_exec: int = 0) -> float:
        """Create a function for a shell command and time it."""
        def cmd2():
            self.runcmd(cmd)
        if not number_of_exec:
            number_of_exec = self.iterations
        return timeit(cmd2, number=number_of_exec) / number_of_exec

    @staticmethod
    @strict
    def runcmd(cmd: str, to_stdin: Optional[str] = None) -> CompletedProcess:
        """Run a command with default settings."""
        return run(cmd, shell=True, check=True, stdout=PIPE, input=to_stdin)

    @strict
    def get_existing_stats(self) -> Dict[str, List[float]]:
        """Retrieve any existing statistics from stats.json."""
        try:
            with open("stats.json") as stats:
                return loads(stats.read())
        except FileNotFoundError:
            return {fn: [] for fn in listdir(self.parent_dir)}


class TimeI3BlocksScripts(TimeCommands):
    """Time the scripts stored at /home/scott/.i3/blocks/."""

    def __init__(self):
        """Initialize stuff specific to this folder, then pass to super."""
        parent_dir = "/home/scott/.i3/blocks"
        super().__init__(parent_dir=parent_dir, rate_limited=[
            'public_ip',
            'weather'
        ])


TimeI3BlocksScripts()
