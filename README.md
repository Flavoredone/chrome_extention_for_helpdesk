1. Репозиторий скачивается, так ставится расширение (надо выбрать папку `extension` при его распаковке в панели расширений). `requirements.txt` нет, но думаю что это будет поводом посмотреть в код.
![image](https://github.com/user-attachments/assets/b3660708-1b7d-4d77-ae8f-915ccab245d5)

2. Генерируется ключ API в Helpdesk, и копируется в `service_desk_connector.py`:
![image](https://github.com/user-attachments/assets/8babd6f6-1414-4e62-9f90-444a09c60292)

3. В корневой директории запускается прокси-сервер с CORS (гугловская шняга, чтобы обойти политики блокировки) командой `python app.py` (он поднимется на `localhost:5000`)
![image](https://github.com/user-attachments/assets/ed45dad1-8688-4f74-ae5e-251e714feb13)

4. Выглядит сама морда вот так:

![image](https://github.com/user-attachments/assets/3435b7c7-daa1-4179-a942-b7968017e931)

![image](https://github.com/user-attachments/assets/250691fa-e9c1-4df2-b812-727c3c9fed53)

