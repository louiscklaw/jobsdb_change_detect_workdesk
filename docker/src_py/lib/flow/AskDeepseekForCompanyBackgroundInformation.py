import os, sys, json
from lib.pb import UpdateDsDigestStatus
from lib.db.WriteDsDigestMeta import WriteDsDigestMeta
from lib.db.ParseJsonFromDsAnswer import ParseJsonFromDsAnswer
from lib.NewDivider import NewDivider
from lib.flow.LookupCompanyWebsite import LookupCompanyWebsite
from lib.ds.CheckAnswerIfServerBusy import CheckAnswerIfServerBusy


def AskDeepseekForCompanyBackgroundInformation(
    api, chat_id, result_id, fetched_company_name
):

    # lookup company website
    lookup_company_background_raw_answer = LookupCompanyWebsite(
        api, chat_id, fetched_company_name
    )
    CheckAnswerIfServerBusy(lookup_company_background_raw_answer)

    NewDivider()

    lookup_company_background_json = ParseJsonFromDsAnswer(
        lookup_company_background_raw_answer
    )

    if lookup_company_background_json["lookup_result"] == "SUCCESS":
        WriteDsDigestMeta(
            result_id,
            {
                # "summarize_of_job_ad": "summarize_of_job_ad",
                # "name_of_company": "name_of_company",
                "lookup_company_background": lookup_company_background_json,
                # "company_background": company_background,
            },
        )
    UpdateDsDigestStatus(result_id)


def Helloworld():
    print("helloworld")
