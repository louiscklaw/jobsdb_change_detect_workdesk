import os, sys
from lib.db.ParseJsonFromDsAnswer import ParseJsonFromDsAnswer
from lib.pb import UpdateDsDecision
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy


def GetQ_01():
    return """
Thank you.

From two pieces information (`JOB_AD_DETAILS` and `CANDIATES_BACKGROUND`) above.
Will you recommend the post to candiate ?

please restrict your answer in the json format below:

```json
{
    recommend: <YES | NO>,
    reason: <YES-REASON | NO-REASON>
}
```
""".strip()


def ConsolateInformationsAltogether(api, chat_id, result_id):
    parent_id = api.parent_id

    print(f"({parent_id}) Q: " + GetQ_01())
    print(f"({parent_id}) A: ", end="")
    answer_raw = ""

    for chunk in api.chat_completion(
        chat_id,
        GetQ_01(),
        thinking_enabled=True,
        search_enabled=True,
        parent_message_id=parent_id,
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
            answer_raw += chunk["content"]
    CheckAnswerIfServerBusy(answer_raw)

    answer_json = ParseJsonFromDsAnswer(answer_raw)
    UpdateDsDecision(result_id, answer_json)

    return answer_json


def Helloworld():
    print("helloworld")
