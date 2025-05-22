import os, sys


class DsError(Exception):
    """Base exception for all DeepSeek API errors"""

    pass


def CheckAnswerIfServerBusy(answer_to_check):

    if answer_to_check.find("busy") > -1:
        raise DsError("Deepseek server busy")
