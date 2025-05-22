import os, sys

from pocketbase import PocketBase  # Client also works the same

client = PocketBase("http://pocketbase:8090")
# login as admin


def FetchUnAskedJobAd():
    try:
        admin_data = client.admins.auth_with_password("admin@123.com", "Aa12345678")

        result = client.collection("002_job_list").get_list(
            1,
            3,
            {"filter": 'status = "JOB_DETAIL_GET"'},
            # {"filter": 'jobId = "83754168"'},
        )

        return result.items[0]
    except Exception as e:
        print(e)


def WriteDsDigest(record_id, name_of_company):
    try:
        admin_data = client.admins.auth_with_password("admin@123.com", "Aa12345678")

        result = client.collection("002_job_list").get_one(record_id)

        client.collection("002_job_list").update(
            record_id, {"name_of_company": name_of_company}
        )

    except Exception as e:
        print(e)
        pass


def WriteDsSummarize(record_id, value):
    try:
        admin_data = client.admins.auth_with_password("admin@123.com", "Aa12345678")

        result = client.collection("002_job_list").get_one(record_id)

        client.collection("002_job_list").update(
            record_id, {"summarize_of_job_ad": value}
        )

    except Exception as e:
        print(e)


def WriteDsDigestMeta(record_id, value):
    try:
        # admin_data = client.admins.auth_with_password("admin@123.com", "Aa12345678")
        # result = client.collection("002_job_list").get_one(record_id)

        client.collection("002_job_list").update(record_id, {"ds_digest_meta": value})

    except Exception as e:
        print(e)


def UpdateDsDigestStatus(record_id):
    try:
        print("update " + record_id + " to DS_DIGEST_DONE")
        client.collection("002_job_list").update(
            record_id, {"status": "DS_DIGEST_DONE"}
        )

    except Exception as e:
        print(e)


def UpdateDsDecision(record_id, value):
    try:
        print("update " + record_id + " ds_decision")
        client.collection("002_job_list").update(
            record_id,
            {
                "ds_decision": value,
                "ds_decision_YN": value["recommend"],
            },
        )

    except Exception as e:
        print(e)


def UpdateDraftApplicationLetter(record_id, value):
    try:
        print("update " + record_id + " ds_decision")
        client.collection("002_job_list").update(
            record_id,
            {"draft_application_letter_json": {"content": value}},
        )

    except Exception as e:
        print(e)


def UpdateBlockedAsServerBusy(record_id):
    try:
        print("update " + record_id + " ds_decision")
        client.collection("002_job_list").update(
            record_id,
            {"debug": {"blocked_as_server_busy": True}},
        )

    except Exception as e:
        print(e)


def Helloworld():
    print("helloworld")
