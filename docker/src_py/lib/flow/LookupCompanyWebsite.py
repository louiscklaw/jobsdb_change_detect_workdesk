import os, sys
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy


def GenQ(fetched_company_name):
    return """
please help to search a company named "<fetched_company_name>" website thanks

no need to put the "citation" in your reply
restrict your reply in JSON format like below:

'''json
{
    lookup_result: "<SUCCSS | FAILED>",
    website: "<website-address | NOT_FOUND>",
    linked_in: "<linked_in-address | NOT_FOUND>",
    whatsapp: "<whatsapp-contact | NOT_FOUND>"
    ...
}
'''
""".strip().replace(
        "<fetched_company_name>", fetched_company_name
    )


def LookupCompanyWebsite(api, chat_id, fetched_company_name):
    parent_id = api.parent_id
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
