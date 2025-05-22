import os, sys
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy

JOB_AD_TEST = """
KPMG China provides multidisciplinary services from audit and tax to advisory, with a strong focus on serving our clients’ needs and their industries. Not only do we have an overriding commitment to provide the highest quality services for our clients, but we also strive to become a responsible corporate citizen that has a positive impact on our environment and community. At KPMG, you’ll translate insights into action and reveal opportunities for all—our teams, our clients and our world.

"""

Q_01 = f"""
I found a job ad as below,
no need to share me your digest at the moment.

please read, understand and remember it then reply me \"OK\".
I will send you the question later.

job ad:
```markdown
{JOB_AD_TEST}
```
""".strip()


def GetQ_01(job_ad_details_md):
    return f"""
I found a job ad as below,
no need to share me your digest at the moment.

please read, understand and remember it then reply me \"OK\".
I will send you the question later.

job ad:
```markdown
# JOB_AD_DETAILS

{job_ad_details_md}
```
""".strip()


def SendJobAdDetail(api, chat_id, job_ad_details_md):
    parent_id = api.parent_id

    print(f"({parent_id}) Q: " + GetQ_01(job_ad_details_md))
    print(f"({parent_id}) A: ", end="")
    answer = ""

    for chunk in api.chat_completion(
        chat_id,
        GetQ_01(job_ad_details_md),
        thinking_enabled=True,
        search_enabled=True,
        parent_message_id=parent_id,
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
            answer += chunk["content"]

    CheckAnswerIfServerBusy(answer)

    return answer
