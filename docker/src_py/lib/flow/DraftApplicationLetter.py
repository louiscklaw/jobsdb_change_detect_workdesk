import os, sys
from lib.pb import UpdateDraftApplicationLetter
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy

LETTER_TEMPLATE = """
commpany name: <company-name>

Louis Law

Email: louis@example.com | Mobile: +852 9123 4567

Dear [Hiring Manager’s Name],

[Remarks: If you know the name of the Hiring Manager,
personalise your application by addressing the person directly.
Job ads on LinkedIn, for example, display the name of the person posting the ad.]

Application for the Position of [position-name]

[Remarks: Identify your best skills and focus areas that best fits the job requirements and include this in the overview of your experiences. Metrics help to establish context and scale for your work.]

XYZ Company has been heralded by many technological publications as the future of electronic payments. Industry pioneers such as PayPal and Square have also shared that XYZ Company is championing the innovation and development of secure and transparent electronic payments. My extensive background and knowledge in Fintech and the financial industry, coupled with my technical expertise and practical experience in product development will allow me to effectively drive the development of secure and scalable projects that are built with high quality code.

[Remarks: Focus again on your key skills as required by the job ad. Highlight relevant working experiences and that are directly relevant to the target job role.]

I am thrilled at the possibility of being part of such a renowned firm, and would love the opportunity to meet with you and discuss the value that I can bring to XYZ Company. I appreciate your time and consideration, and I look forward to hearing from you. Please feel free to contact me at any time via mobile at +852 9123 4567 or by email at louislaw@example.com.

[Remarks: End off your Cover Letter with a call-to-action – show your enthusiasm in meeting your potential employer, and provide them ways you can be contacted.]

Yours sincerely,
Louis Law
"""


def GetQ_01():
    return f"""
OK, Thank you for your insight,

Imagine you are "Louis" and you want to apply this job.
Would you help to draft the application letter for this post ?

In you letter:
- Please keep your letter in below 200 words and,
- link up the candiate background (e.g. "CANDIATES_BACKGROUND")  to the job requirements in the letter.
- show what the candiate knows only in `CANDIATES_BACKGROUND`, do not imagine the things that no appears


Please restrict your reply in markdown format below:

```markdown
{LETTER_TEMPLATE}
```
""".strip()


def DraftApplicationLetter(api, chat_id, record_id):
    parent_id = api.parent_id

    print(f"({parent_id}) Q: " + GetQ_01())
    print(f"({parent_id}) A: ", end="")
    answer_letter_md = ""

    for chunk in api.chat_completion(
        chat_id,
        GetQ_01(),
        thinking_enabled=True,
        search_enabled=True,
        parent_message_id=parent_id,
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
            answer_letter_md += chunk["content"]
    CheckAnswerIfServerBusy(answer_letter_md)

    # UpdateDraftApplicationLetter(record_id, answer_letter_md)

    answer_letter_md = answer_letter_md.replace("```markdown", "```").replace("```", "")

    return answer_letter_md


def Helloworld():
    print("helloworld")
