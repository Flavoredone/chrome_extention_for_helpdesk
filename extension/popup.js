document.addEventListener('DOMContentLoaded', () => {
  let woID = null;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      const tabUrl = activeTab.url;
      console.log('URL текущей вкладки:', tabUrl);

      const url = new URL(tabUrl);
      woID = url.searchParams.get('woID');
      console.log('woID:', woID);

      if (!woID) {
        console.log('woID не найден в URL.');
      } else {
        console.log(`woID найден: ${woID}`);
      }
    }
  });

  // // Получение списка заявок
  // document.getElementById('getRequests').addEventListener('click', () => {
  //   const viewId = document.getElementById('viewId').value;
  //   fetch(`http://localhost:5000/get_requests?view_id=${encodeURIComponent(viewId)}`)
  //     .then(response => response.json())
  //     .then(data => {
  //       document.getElementById('requestsResult').innerHTML =
  //         `Найдено заявок: ${data.count}<br>ID заявок: ${data.ids.join(', ')}`;
  //     })
  //     .catch(error => showError('requestsResult', error));
  // });

  // Получение информации о заявке
  document.getElementById('getRequestInfo').addEventListener('click', () => {
    if (!woID) {
      woID = document.getElementById('reqId').value;
    }

    fetch(`http://localhost:5000/get_request_info?req_id=${woID}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('requestInfoResult').innerHTML = formatJson(data);
      })
      .catch(error => showError('requestInfoResult', error));
  });

  // Изменение техника
  document.getElementById('changeTechnician').addEventListener('click', () => {

    if (!woID) {
      return showError('changeTechResult', 'woID не найден в URL.');
    }

    const technician = document.getElementById('newTechnician').value;

    if (!technician) return showError('changeTechResult', 'Заполните все поля');

    fetch('http://localhost:5000/update_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ req_id: woID, technician: technician })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('changeTechResult').innerHTML =
          `Статус: ${data.status}<br>Сообщение: ${data.message}`;
      })
      .catch(error => showError('changeTechResult', error));
  });

  // Изменение статуса
  document.getElementById('changeStatus').addEventListener('click', () => {
    if (!woID) {
      return showError('changeStatusResult', 'woID не найден в URL.');
    }

    const status = document.getElementById('newStatus').value;

    if (!status) return showError('changeStatusResult', 'Заполните все поля');

    fetch('http://localhost:5000/update_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ req_id: woID, status: status })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('changeStatusResult').innerHTML =
          `Статус: ${data.status}<br>Сообщение: ${data.message}`;
      })
      .catch(error => showError('changeStatusResult', error));
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function handleClick(buttonId, url1, url2, category, subcategory, group, specialist ) {
    document.getElementById(buttonId).addEventListener('click', () => {
      if (!woID) {
        return showError('changeStatusResult', 'woID не найден в URL.');
      }

      fetch(url1, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ req_id: woID, category: category, subcategory: subcategory })
      })
        .then(response => response.json())
        .then(data => {
          document.getElementById('changeStatusResult').innerHTML =
            `Статус: ${data.status}<br>Сообщение: ${data.message}`;

          return fetch(url2, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ req_id: woID, group: group, specialist: specialist })
          });
        })
        .then(response => response.json())
        .then(data => {
          document.getElementById('changeStatusResult').innerHTML =
            `Статус: ${data.status}<br>Сообщение: ${data.message}`;
        })
        .catch(error => showError('changeStatusResult', error));
    });
  }

  function handleClick2(buttonId, url1, url2, url3, category, subcategory, group, specialist) {
    document.getElementById(buttonId).addEventListener('click', () => {
        if (!woID) {
            return showError('changeStatusResult', 'woID не найден в URL.');
        }

        // Первый запрос
        fetch(url1, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ req_id: woID, category, subcategory })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('changeStatusResult').innerHTML = 
                `Статус: ${data.status}<br>Сообщение: ${data.message}`;
            
            // Второй запрос
            return fetch(url2, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ req_id: woID, group, specialist: specialist })
            });
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('changeStatusResult').innerHTML = 
                `Статус: ${data.status}<br>Сообщение: ${data.message}`;
            
            // Третий запрос
            return fetch(url3, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ req_id: woID, priority: '№3 - 8', request_type: 'Обслуживание' })
            });
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('changeStatusResult').innerHTML = 
                `Статус: ${data.status}<br>Сообщение: ${data.message}`;
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showError('changeStatusResult', 'Произошла ошибка при выполнении запроса.');
        });
    });
}

  handleClick('set1cerp', 'http://localhost:5000/set1cerp1', 'http://localhost:5000/set1cerp2', 'Поддержка 1С', 'ERP', 'ERP 1-я Линия', '');
  handleClick('set1ccrm', 'http://localhost:5000/set1ccrm1', 'http://localhost:5000/set1ccrm2', 'Поддержка 1С', 'CRM', 'CRM 1-я Линия', '');
  handleClick('set1cdiadoc', 'http://localhost:5000/set1cdiadoc1', 'http://localhost:5000/set1cdiadoc2', 'Поддержка 1С', 'Диадок', 'Диадок 1-я Линия', '');
  handleClick('set1cbilling', 'http://localhost:5000/set1cbilling1', 'http://localhost:5000/set1cbilling2', 'Поддержка 1С', 'Биллинг', 'Биллинг 1-я Линия', '');
  handleClick('set1cdoc', 'http://localhost:5000/set1cdoc1', 'http://localhost:5000/set1cdoc2', 'Поддержка 1С', 'Документооборот', 'Документооборот 1-я Линия', '');
  handleClick('set1czup', 'http://localhost:5000/set1czup1', 'http://localhost:5000/set1czup2', 'Поддержка 1С', 'ЗУП', 'ЗУП 1-я Линия', '');

  // setuvolnenie2
  // setgurushkin2
  // setborisenkov2
  // setsharov2
  // setlyashkov2
  // settelephony2

  handleClick('uvolnenie',  'http://localhost:5000/setuvolnenie1',  'http://localhost:5000/setuvolnenie2',  'ИТ Сервисы', 'Административные услуги', 'Увольнение', '');
  handleClick2('gurushkin',  'http://localhost:5000/setgurushkin1',  'http://localhost:5000/setgurushkin2', 'http://localhost:5000/setgurushkin3',  'ИТ Сервисы', 'Административные услуги', 'Группа поддержки ИТ сервисов', 'Гурушкин Георгий Александрович');
  handleClick2('borisenkov', 'http://localhost:5000/setborisenkov1', 'http://localhost:5000/setborisenkov2','http://localhost:5000/setborisenkov3', 'ИТ Сервисы', 'Административные услуги', 'Группа поддержки ИТ сервисов', 'Борисенков Владимимр Олегович');
  handleClick2('sharov',     'http://localhost:5000/setsharov1',     'http://localhost:5000/setsharov2',    'http://localhost:5000/setsharov3',     'ИТ Сервисы', 'Административные услуги', 'Группа поддержки площадок', 'Шаров Николай Викторович');
  handleClick2('lyashkov',   'http://localhost:5000/setlyashkov1',   'http://localhost:5000/setlyashkov2',  'http://localhost:5000/setlyashkov3',   'ИТ Сервисы', 'Административные услуги', 'Группа поддержки площадок', 'Ляшков Андрей Юрьевич');
  handleClick2('telephony',  'http://localhost:5000/settelephony1',  'http://localhost:5000/settelephony2', 'http://localhost:5000/settelephony3',  'ИТ Сервисы', 'Административные услуги', 'Группа поддержки телефонии', 'Шаров Николай Викторович');

  // setcscar2
  // setcsmart2
  // setcshome2
  // setcslogistic2
  // setactivationport2
  // setalertport2

  handleClick('cscar',          'http://localhost:5000/setcscar1',          'http://localhost:5000/setcscar2',          'Бизнес Сервисы', 'Cesar Car',         'Группа поддержки бизнес сервисов', '');
  handleClick('csmart',         'http://localhost:5000/setcsmart1',         'http://localhost:5000/setcsmart2',         'Проблемы Smart', 'Вопрос по пользованию системой или МП', 'Группа поддержки бизнес сервисов', '');
  handleClick('cshome',         'http://localhost:5000/setcshome1',         'http://localhost:5000/setcshome2',         'Бизнес Сервисы', 'Cesar Home',        'Группа поддержки бизнес сервисов', '');
  handleClick('cslogistic',     'http://localhost:5000/setcslogistic1',     'http://localhost:5000/setcslogistic2',     'Бизнес Сервисы', 'Wialon',            'Группа поддержки бизнес сервисов', '');
  handleClick('activationport', 'http://localhost:5000/setactivationport1', 'http://localhost:5000/setactivationport2', 'Бизнес Сервисы', 'Портал Активации',  'Группа поддержки бизнес сервисов', '');
  handleClick('alertport',      'http://localhost:5000/setalertport1',       'http://localhost:5000/setalertport2',       'Бизнес Сервисы', 'Портал тревог НДВ', 'Группа поддержки бизнес сервисов', '');

  // setaxapta1
  // setsecurity1
  // setdezh1
  // setoppauto1
  // setoppndv1
  // setmacroscop1
 
  handleClick('axapta',          'http://localhost:5000/setaxapta1',    'http://localhost:5000/setaxapta2',     'Аксапта', 'Axapta', 'Поддержка Axapta', '');
  handleClick('security',        'http://localhost:5000/setsecurity1',  'http://localhost:5000/setsecurity2',   'Безопасность', 'Отдел информационной безопасности', 'Отдел информационной безопасности', '');
  handleClick2('dezh',           'http://localhost:5000/setdezh1',      'http://localhost:5000/setdezh2',    'http://localhost:5000/setdezh3',   'ИТ Сервисы', 'Дежурные', 'Группа поддержки дежурных', '');
  handleClick('oppauto',         'http://localhost:5000/setoppauto1',   'http://localhost:5000/setoppauto2',    'Дирекция сервис', 'ОПП Авто', 'Эксперты ОПП Авто', '');
  handleClick('oppndv',          'http://localhost:5000/setoppndv1',    'http://localhost:5000/setoppndv2',     'Дирекция сервис', 'ОПП НДВ', 'Эксперты ОПП НДВ', '');
  handleClick('macroscop',       'http://localhost:5000/setmacroscop1', 'http://localhost:5000/setmacroscop2',  'ИТ Сервисы', 'Macroscop', 'Macroscop', 'Редькин Вячеслав Сергеевич');


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Вспомогательные функции
  function formatJson(data) {
    return JSON.stringify(data, null, 2)
      .replace(/\n/g, '<br>')
      .replace(/ /g, '&nbsp;');
  }

  function showError(elementId, error) {
    console.error(error);
    document.getElementById(elementId).innerHTML =
      `Ошибка: ${error.message || error}`;
  }

});
