import os, sys
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy


def GenQ(fetched_company_name):
    return """
# COMPANY_BACKGROUND

Can you please help to look up the "<fetched_company_name>" background information (e.g. content of the "about us" on the internet) ?

Read it and then summarize it in around 30 words.
Thanks

Below is the reply format for your reference:

```json
{
    content: <content-of-the-summary>
    website: <source-of-your-content>
}
```
""".strip().replace(
        "<fetched_company_name>", fetched_company_name
    )


def CheckCompanyBackground(api, chat_id, parent_id, fetched_company_name):
    q = GenQ(fetched_company_name)
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
