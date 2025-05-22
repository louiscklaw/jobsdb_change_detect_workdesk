#!/usr/bin/env python
import os, sys, json

from lib.helloworld import Helloworld
from lib.NewDivider import NewDivider

from lib.pb import (
    FetchUnAskedJobAd,
    UpdateDraftApplicationLetter,
    UpdateBlockedAsServerBusy,
)

from lib.flow.SendJobAdDetail import SendJobAdDetail
from lib.flow.SendGuidelines import SendGuidelines
from lib.flow.ConsolateInformationsAltogether import ConsolateInformationsAltogether
from lib.flow.DraftApplicationLetter import DraftApplicationLetter
from lib.flow.TellDeepseekForCandiateBackground import TellDeepseekForCandiateBackground
from lib.flow.AskDeepseekForCompanyBackgroundInformation import (
    AskDeepseekForCompanyBackgroundInformation,
)

from dsk.api import DeepSeekAPI
from dsk.api import (
    DeepSeekAPI,
    AuthenticationError,
    RateLimitError,
    NetworkError,
    CloudflareError,
    APIError,
)
from lib.ds.CheckAnswerIfServerBusy import DsError


DS_AUTH_TOKEN = os.getenv("REPORTING_DS_AUTH_TOKEN")

# Initialize with your auth token
api = DeepSeekAPI(DS_AUTH_TOKEN)

# Start a conversation
chat_id = api.create_chat_session()
parent_id = None

result = FetchUnAskedJobAd()
if result == None:
    print("no new job detail remaining")
    sys.exit(0)

try:

    job_ad_details_md = result.job_ad_details_md
    fetched_company_name = result.advertiser_name_md
    print(fetched_company_name)

    # Send initial message
    SendGuidelines(api, chat_id)
    NewDivider()

    print("done" + result.id)

except DsError:
    print("deepseek server busy")
    UpdateBlockedAsServerBusy(result.id)

except AuthenticationError:
    print("Authentication failed. Please check your token.")

except RateLimitError:
    print("Rate limit exceeded. Please wait before making more requests.")

except CloudflareError as e:
    print(f"Cloudflare protection encountered: {str(e)}")

except NetworkError:
    print("Network error occurred. Check your internet connection.")

except APIError as e:
    print(f"API error occurred: {str(e)}")
