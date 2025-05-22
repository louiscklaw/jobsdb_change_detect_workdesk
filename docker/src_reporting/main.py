#!/usr/bin/env python
import os, sys, json

from lib.helloworld import Helloworld
from lib.NewDivider import NewDivider

from lib.pb import (
    FetchDsDecisionRecommendEqualsNo,
    UpdateBlockedAsServerBusy,
    UpdateDsDecisionReview,
)

from lib.flow.SendGuidelines import SendGuidelines
from lib.flow.QnAReviewNotRecommendReason import QnAReviewNotRecommendReason

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

results = FetchDsDecisionRecommendEqualsNo()
if results == None:
    print("no new ds_decision remaining")
    sys.exit(0)

try:
    # Send initial message
    SendGuidelines(api, chat_id)
    NewDivider()

    for result in results:
        ds_decision = result.ds_decision

        ds_decision_review_json = QnAReviewNotRecommendReason(api, chat_id, ds_decision)
        NewDivider()

        UpdateDsDecisionReview(result.id, ds_decision_review_json)

        print("done" + result.id)

except DsError:
    print("deepseek server busy")
    UpdateBlockedAsServerBusy(results.id)

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
