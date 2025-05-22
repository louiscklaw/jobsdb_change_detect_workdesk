q = "what is the company name ?"


def AskNameOfTheCompany(api, chat_id, parent_id):
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

    return answer
