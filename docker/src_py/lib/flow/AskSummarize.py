import os, sys
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy

q = "Please help to Summarize the job ad in around 30 words"


def AskSummarize(api, chat_id, parent_id):
    print(f"({parent_id}) Q: " + q)
    print(f"({parent_id}) A: ", end="")

    answer = ""
    for chunk in api.chat_completion(
        chat_id,
        q,
        parent_message_id=parent_id,
        thinking_enabled=True,
        search_enabled=True,
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
            answer += chunk["content"]

    CheckAnswerIfServerBusy(answer)

    return answer
