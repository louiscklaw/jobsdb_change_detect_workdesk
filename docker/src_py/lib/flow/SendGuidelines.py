import os, sys
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy

GUIDELINES = """
hey deepseek, i need your help.

I want you to help decide a candiate suitable for a job ad or not.
I will guide you through steps by steps we will finish the task.

please read, understand and remember the below guideline
this guideline is valid through out the steps.

```markdown
## CONVERSATION GUIDELINES

- keep your answer short
  - e.g. name of the company is "GOOGLE INC."

## FAQ

T.B.A.
```
"""


def SendGuidelines(api, chat_id):
    print("() Q: " + GUIDELINES)
    print("() A: ", end="")

    answer = ""

    for chunk in api.chat_completion(
        chat_id,
        GUIDELINES,
        thinking_enabled=True,
        search_enabled=True,
        #
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
            answer += chunk["content"]

    CheckAnswerIfServerBusy(answer)
