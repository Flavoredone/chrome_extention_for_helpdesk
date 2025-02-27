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


  function handleClick(buttonId, url1, url2, category, subcategory, group) {
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
            body: JSON.stringify({ req_id: woID, group: group, specialist: '' })
          });
        })
        .then(response => response.json())
        .then(data => {
          document.getElementById('changeStatusResult').innerHTML =
            `Статус: ${data.status}<br>Сообщение: ${data.message}`;
          location.reload(true);
        })
        .catch(error => showError('changeStatusResult', error));
    });
  }

  handleClick('set1cerp', 'http://localhost:5000/set1cerp1', 'http://localhost:5000/set1cerp2', 'Поддержка 1С', 'ERP', 'ERP 1-я Линия');
  handleClick('set1ccrm', 'http://localhost:5000/set1ccrm1', 'http://localhost:5000/set1ccrm2', 'Поддержка 1С', 'CRM', 'CRM 1-я Линия');
  handleClick('set1cdiadoc', 'http://localhost:5000/set1cdiadoc1', 'http://localhost:5000/set1cdiadoc2', 'Поддержка 1С', 'Диадок', 'Диадок 1-я Линия');
  handleClick('set1cbilling', 'http://localhost:5000/set1cbilling1', 'http://localhost:5000/set1cbilling2', 'Поддержка 1С', 'Биллинг', 'Биллинг 1-я Линия');
  handleClick('set1cdoc', 'http://localhost:5000/set1cdoc1', 'http://localhost:5000/set1cdoc2', 'Поддержка 1С', 'Документооборот', 'Документооборот 1-я Линия');
  handleClick('set1czup', 'http://localhost:5000/set1czup1', 'http://localhost:5000/set1czup2', 'Поддержка 1С', 'ЗУП', 'ЗУП 1-я Линия');


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
