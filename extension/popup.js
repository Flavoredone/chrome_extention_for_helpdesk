document.addEventListener('DOMContentLoaded', () => {
  let woID = null;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      const tabUrl = activeTab.url;
      console.log('URL текущей вкладки:', tabUrl);

      // Теперь вы можете использовать tabUrl для извлечения woID или других параметров
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

  // Получение списка заявок
  document.getElementById('getRequests').addEventListener('click', () => {
    const viewId = document.getElementById('viewId').value;
    fetch(`http://localhost:5000/get_requests?view_id=${encodeURIComponent(viewId)}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('requestsResult').innerHTML =
          `Найдено заявок: ${data.count}<br>ID заявок: ${data.ids.join(', ')}`;
      })
      .catch(error => showError('requestsResult', error));
  });

  // Получение информации о заявке
  document.getElementById('getRequestInfo').addEventListener('click', () => {
    if (!woID) {
      return showError('requestInfoResult', 'woID не найден в URL.');
    }

    fetch(`http://localhost:5000/get_request_info?req_id=${woID}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('requestInfoResult').innerHTML =
          formatJson(data);
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


// document.addEventListener('DOMContentLoaded', () => {
//   // Получение списка заявок
//   document.getElementById('getRequests').addEventListener('click', () => {
//       const viewId = document.getElementById('viewId').value;
//       fetch(`http://localhost:5000/get_requests?view_id=${encodeURIComponent(viewId)}`)
//           .then(response => response.json())
//           .then(data => {
//               document.getElementById('requestsResult').innerHTML = 
//                   `Найдено заявок: ${data.count}<br>ID заявок: ${data.ids.join(', ')}`;
//           })
//           .catch(error => showError('requestsResult', error));
//   });

//   // Получение информации о заявке
//   document.getElementById('getRequestInfo').addEventListener('click', () => {
//       const reqId = document.getElementById('reqId').value;
//       if (!reqId) return showError('requestInfoResult', 'Введите Request ID');
      
//       fetch(`http://localhost:5000/get_request_info?req_id=${reqId}`)
//           .then(response => response.json())
//           .then(data => {
//               document.getElementById('requestInfoResult').innerHTML = 
//                   formatJson(data);
//           })
//           .catch(error => showError('requestInfoResult', error));
//   });

//   // Изменение техника
//   document.getElementById('changeTechnician').addEventListener('click', () => {
//       const reqId = document.getElementById('changeReqId').value;
//       const technician = document.getElementById('newTechnician').value;
      
//       if (!reqId || !technician) return showError('changeTechResult', 'Заполните все поля');
      
//       fetch('http://localhost:5000/update_request', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ req_id: reqId, technician: technician })
//       })
//       .then(response => response.json())
//       .then(data => {
//           document.getElementById('changeTechResult').innerHTML = 
//               `Статус: ${data.status}<br>Сообщение: ${data.message}`;
//       })
//       .catch(error => showError('changeTechResult', error));
//   });

//   // Изменение статуса
//   document.getElementById('changeStatus').addEventListener('click', () => {
//       const reqId = document.getElementById('statusReqId').value;
//       const status = document.getElementById('newStatus').value;
      
//       if (!reqId || !status) return showError('changeStatusResult', 'Заполните все поля');
      
//       fetch('http://localhost:5000/update_request', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ req_id: reqId, status: status })
//       })
//       .then(response => response.json())
//       .then(data => {
//           document.getElementById('changeStatusResult').innerHTML = 
//               `Статус: ${data.status}<br>Сообщение: ${data.message}`;
//       })
//       .catch(error => showError('changeStatusResult', error));
//   });

//   // Вспомогательные функции
//   function formatJson(data) {
//       return JSON.stringify(data, null, 2)
//           .replace(/\n/g, '<br>')
//           .replace(/ /g, '&nbsp;');
//   }

//   function showError(elementId, error) {
//       console.error(error);
//       document.getElementById(elementId).innerHTML = 
//           `Ошибка: ${error.message || error}`;
//   }
// });