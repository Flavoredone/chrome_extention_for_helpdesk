import json
import requests

api_key = ""
url = "http://192.168.91.235/sdpapi/request"

# 411755

def send_post(params, input_data, request_id=None):
    input_data_json = json.dumps(input_data)
    try:
        if not request_id:
            response = requests.post(url, params=params, data={'INPUT_DATA': input_data_json})
        else:
            response = requests.post(f"{url}/{request_id}", data={'INPUT_DATA': input_data_json}, params=params)

        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP ошибка: {http_err}")
        return None
    except requests.exceptions.RequestException as req_err:
        print(f"Ошибка запроса: {req_err}")
        return None
    except json.JSONDecodeError as json_err:
        print(f"Ошибка парсинга JSON: {json_err}")
        return None


def get_all_req_for(view_id):
    params = {
        "OPERATION_NAME": "GET_REQUESTS",
        "TECHNICIAN_KEY": api_key,
        "format": "json"
    }
    input_data = {
        "operation": {
            "details": {
                "from": 0,
                "limit": 500,
                "filterby": view_id
            }
        }
    }
    response_data = send_post(params, input_data)
    requests_list = response_data.get("operation", {}).get("details", [])
    count = 0
    for request in requests_list:
        workorder_id = request.get("WORKORDERID")
        if workorder_id:
            print("WORKORDERID:", workorder_id)
            count += 1

    print(f"Всего заявок: {count}")


def get_req_info(req_id):
    params = {
        "TECHNICIAN_KEY": api_key,
        "format": "json",
        "OPERATION_NAME": "GET_REQUEST",
    }

    response_data = send_post(params, None, request_id=req_id)

    return response_data

def send_note(req_id, note):
    params = {
        "TECHNICIAN_KEY": api_key,
        "format": "json",
        "OPERATION_NAME": "ADD_NOTE",
    }
    input_data = {
        "operation": {
            "details": {
                "notes":{
                    "note": {
                        "ispublic": "false",
                        "notestext": note
                    }
                }
            }
        }
    }
    response_data = send_post(params, input_data, request_id=req_id, isNote=True)
    return response_data

class RequestUpdater:
    def __init__(self):
        self.api_key = api_key
        self.params = {
            "TECHNICIAN_KEY": api_key,
            "format": "json",
            "OPERATION_NAME": "EDIT_REQUEST",
        }

    def change_bot_exec(self, req_id, comment):
        input_data = {
            "operation": {
                "details": {
                    "BOT EXEC": comment
                }
            }
        }
        return send_post(self.params, input_data, req_id)


    def change_category(self, req_id, new_category):
        input_data = {
            "operation": {
                "details": {
                    "category": new_category
                }
            }
        }
        return send_post(self.params, input_data, req_id)


    def change_subcategory(self, req_id, new_category, new_subcategory):
        input_data = {
            "operation": {
                "details": {
                    "category": new_category,
                    "SUBCATEGORY": new_subcategory
                }
            }
        }
        return send_post(self.params, input_data, req_id)


    def change_group(self, req_id, new_group, technician):
        input_data = {
            "operation": {
                "details": {
                    "group": new_group,
                    "TECHNICIAN": technician
                }
            }
        }
        return send_post(self.params, input_data, req_id)


    def change_technician(self, req_id, technician):
        input_data = {
            "operation": {
                "details": {
                    "TECHNICIAN": technician
                }
            }
        }
        return send_post(self.params, input_data, req_id)


    def change_status(self, req_id, status):
        input_data = {
            "operation": {
                "details": {
                    "status": status
                }
            }
        }
        return send_post(self.params, input_data, req_id)
