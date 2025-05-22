import os, sys
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy

CANDIATE_BACKGROUND = """

# CANDIATE_BACKGROUND

## SELF-INTRODUCTION

```markdown

For more details please visit my portfolio [here](https://portfolio.louislabs.com).

Hi, This is Louis
and here is some text about me.

I have a strong background in programming, particularly in JavaScript and Python.
You can find them from my [GitHub profile](https://github.com/louiscklaw) here.

I am also proficient in Docker and have experience with web development using React.
During my free time,
I enjoy working on software projects such as Arduino, Raspberry Pi, React, GatsbyJS, PHP, C, Python, and Appium.
I also have experience with hardware and electronics, PCB layout design, 3D modeling, web scraping, and GitHub searching.

## Work History:

- Quality Assurance Engineer(Automation) - Handy

- Validation engineer - Sierrawireless
    - [about sierra](https://www.sierrawireless.com/)
    - [glassdoor](https://www.glassdoor.com.hk/Salary/Sierra-Wireless-Validation-Engineer-Hong-Kong)

- Engineer(RAN, Radio Access Network) - China Mobile Hong Kong
    - [linked in](https://hk.linkedin.com/company/china-mobile-hong-kong)

## Education Background:

- Bachelor of Engineering in Electronic and Communication Engineering
    - [City University of Hong Kong](https://www.cityu.edu.hk/admo/programmes/beng-electronic-and-electrical-engineering)

- Higher Diploma in Electrical Engineering
    - [Tsing Yi (IVE)Institute of Vocational Education](https://www.vtc.edu.hk/admission/en/programme/eg114401-higher-diploma-in-electrical-engineering/)

- Diploma in Electronic and Communication Engineering (Kwun Tong Technical Institute)
    - [Kwun Tong Technical Institute](https://vpet.vtc.edu.hk/wiki/index.php?title=Kwun_Tong_Technical_Institute/)

```
"""


def GetQ_01(candiate_background):
    return f"""
OK, I found a candiate that probably match the position
I send you background information (in markdown format) as below,
no need to share me your digest at the moment.

please read, understand and remember it then reply me \"OK\".

I will send you the question later.

candiate background:
```markdown
{candiate_background}
```
""".strip()


def TellDeepseekForCandiateBackground(api, chat_id):
    parent_id = api.parent_id

    print(f"({parent_id}) Q: " + GetQ_01(CANDIATE_BACKGROUND))
    print(f"({parent_id}) A: ", end="")
    answer = ""

    for chunk in api.chat_completion(
        chat_id,
        GetQ_01(CANDIATE_BACKGROUND),
        thinking_enabled=True,
        search_enabled=True,
        parent_message_id=parent_id,
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
            answer += chunk["content"]

    CheckAnswerIfServerBusy(answer)

    return answer


def Helloworld():
    print("helloworld")
