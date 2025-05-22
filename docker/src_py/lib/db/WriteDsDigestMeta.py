import os, sys

from pocketbase import PocketBase  # Client also works the same

client = PocketBase("http://pocketbase:8090")


def WriteDsDigestMeta(record_id, value):
    try:
        # admin_data = client.admins.auth_with_password("admin@123.com", "Aa12345678")
        # result = client.collection("002_job_list").get_one(record_id)

        client.collection("002_job_list").update(record_id, {"ds_digest_meta": value})

    except Exception as e:
        print(e)


def Helloworld():
    print("helloworld")
