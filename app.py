# import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import service_desk_connetor
from service_desk_connetor import get_all_req_for, get_req_info, RequestUpdater

# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.FileHandler('service_desk.log'),
#         logging.StreamHandler()
#     ]
# )

app = Flask(__name__)
CORS(app)

# @app.before_request
# def log_request():
#     timestamp = datetime.now().isoformat()
#     logging.info(f"""
#     Request Received:
#     Time: {timestamp}
#     Method: {request.method}
#     Path: {request.path}
#     Headers: {dict(request.headers)}
#     Args: {request.args}
#     Data: {request.get_data()}
#     """)

# @app.after_request
# def log_response(response):
#     timestamp = datetime.now().isoformat()
#     logging.info(f"""
#     Response Sent:
#     Time: {timestamp}
#     Status: {response.status}
#     Headers: {dict(response.headers)}
#     Data: {response.get_data()}
#     """)
#     return response

@app.route('/get_requests', methods=['GET'])
def handle_get_requests():
    view_id = request.args.get('view_id')
    if not view_id:
        return jsonify({"error": "Missing view_id"}), 400
    
    result = []
    count = 0
    requests_list = get_all_req_for(view_id)
    for request in requests_list:
        workorder_id = request.get("WORKORDERID")
        if workorder_id:
            result.append(workorder_id)
            count += 1

    return jsonify({
        "status": "success",
        "count": count,
        "ids": result
    })

@app.route('/get_request_info', methods=['GET'])
def handle_get_request_info():
    req_id = request.args.get('req_id')
    if not req_id:
        return jsonify({"error": "Missing req_id"}), 400
    
    result = get_req_info(req_id)
    return jsonify(result)

@app.route('/update_request', methods=['POST'])
def handle_update_request():
    data = request.json
    updater = RequestUpdater()
    
    if data.get('technician'):
        result = updater.change_technician(data['req_id'], data['technician'])
    elif data.get('status'):
        result = updater.change_status(data['req_id'], data['status'])
    else:
        return jsonify({"error": "Invalid parameters"}), 400
    
    return jsonify(result)




# ///////////////////////////////////////////////////////////////////////////////////

def handle_request(data, action):
    updater = RequestUpdater()

    if action == 'change_subcategory' and data.get('subcategory'):
        result = updater.change_subcategory(data['req_id'], data['category'], data['subcategory'])
    elif action == 'change_group' and data.get('group'):
        result = updater.change_group(data['req_id'], data['group'], data['specialist'])
    elif action == 'change_priority_and_request_type':
        result = updater.change_priority_and_request_type(data['req_id'], data['priority'], data['request_type'])
    else:
        return jsonify({"error": "Invalid parameters"}), 400

    return jsonify(result)

@app.route('/set1cerp1', methods=['POST'])
@app.route('/set1ccrm1', methods=['POST'])
@app.route('/set1cdiadoc1', methods=['POST'])
@app.route('/set1cbilling1', methods=['POST'])
@app.route('/set1cdoc1', methods=['POST'])
@app.route('/set1czup1', methods=['POST'])
@app.route('/setuvolnenie1', methods=['POST'])
@app.route('/setgurushkin1', methods=['POST'])
@app.route('/setborisenkov1', methods=['POST'])
@app.route('/setsharov1', methods=['POST'])
@app.route('/setlyashkov1', methods=['POST'])
@app.route('/settelephony1', methods=['POST'])
@app.route('/setcscar1', methods=['POST'])
@app.route('/setcsmart1', methods=['POST'])
@app.route('/setcshome1', methods=['POST'])
@app.route('/setcslogistic1', methods=['POST'])
@app.route('/setactivationport1', methods=['POST'])
@app.route('/setalertport1', methods=['POST'])
@app.route('/setaxapta1', methods=['POST'])
@app.route('/setsecurity1', methods=['POST'])
@app.route('/setdezh1', methods=['POST'])
@app.route('/setoppauto1', methods=['POST'])
@app.route('/setoppndv1', methods=['POST'])
@app.route('/setmacroscop1', methods=['POST'])
def handle_set_subcategory():
    data = request.json
    return handle_request(data, 'change_subcategory')

@app.route('/set1cerp2', methods=['POST'])
@app.route('/set1ccrm2', methods=['POST'])
@app.route('/set1cdiadoc2', methods=['POST'])
@app.route('/set1cbilling2', methods=['POST'])
@app.route('/set1cdoc2', methods=['POST'])
@app.route('/set1czup2', methods=['POST'])
@app.route('/setuvolnenie2', methods=['POST'])
@app.route('/setgurushkin2', methods=['POST'])
@app.route('/setborisenkov2', methods=['POST'])
@app.route('/setsharov2', methods=['POST'])
@app.route('/setlyashkov2', methods=['POST'])
@app.route('/settelephony2', methods=['POST'])
@app.route('/setcscar2', methods=['POST'])
@app.route('/setcsmart2', methods=['POST'])
@app.route('/setcshome2', methods=['POST'])
@app.route('/setcslogistic2', methods=['POST'])
@app.route('/setactivationport2', methods=['POST'])
@app.route('/setalertport2', methods=['POST'])
@app.route('/setaxapta2', methods=['POST'])
@app.route('/setsecurity2', methods=['POST'])
@app.route('/setdezh2', methods=['POST'])
@app.route('/setoppauto2', methods=['POST'])
@app.route('/setoppndv2', methods=['POST'])
@app.route('/setmacroscop2', methods=['POST'])
def handle_set_group():
    data = request.json
    return handle_request(data, 'change_group')



@app.route('/setgurushkin3', methods=['POST'])
@app.route('/setborisenkov3', methods=['POST'])
@app.route('/setsharov3', methods=['POST'])
@app.route('/setlyashkov3', methods=['POST'])
@app.route('/settelephony3', methods=['POST'])
@app.route('/setdezh3', methods=['POST'])
def habndle_change_priority_and_request_type():
    data = request.json
    return handle_request(data, 'change_priority_and_request_type')



# ///////////////////////////////////////////////////////////////////////////////////

if __name__ == '__main__':
    app.run(port=5000, debug=True)