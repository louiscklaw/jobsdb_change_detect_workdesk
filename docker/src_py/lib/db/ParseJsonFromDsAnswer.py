import os, sys, json

from pocketbase import PocketBase  # Client also works the same

client = PocketBase("http://pocketbase:8090")

TEST_RAW_ANSWER = """
```json
 {
  "lookup_result": "SUCCESS",
  "website": "https://www.eyt3.net/",
  "linked_in": "https://hk.linkedin.com/company/eyt3-limited",
  "whatsapp": "NOT_FOUND",
  "headquarters": "Pokfulam, Hong Kong [citation:1][citation:3][citation:4]",
  "founded": "2016 [citation: 3][citation: 4]",
  "services": "RegTech, Cybersecurity, Industrial Automation & Control System Security, FinTech Solutions [citation:2][citation:3][citation:7]",
  "employees": "11-50 [citation:3]",
  "competitors": "dragonadvancetech.com and others [citation:4]"
}
```
"""


def ParseJsonFromDsAnswer(lookup_company_background_raw_answer):
    try:
        lookup_company_background_json_string = (
            lookup_company_background_raw_answer.replace("```json", "").replace(
                "```", ""
            )
        )
        lookup_company_background_json = json.loads(
            lookup_company_background_json_string
        )
        return lookup_company_background_json

    except Exception as e:
        print(e)


def Helloworld():
    print("helloworld")
