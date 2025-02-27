document.addEventListener('DOMContentLoaded', () => {
  // Запрос на получение активной вкладки
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
          const tabUrl = activeTab.url;
          console.log('URL текущей вкладки:', tabUrl);

          // Теперь вы можете использовать tabUrl для извлечения woID или других параметров
          const url = new URL(tabUrl);
          const woID = url.searchParams.get('woID');
          console.log('woID:', woID);

          if (!woID) {
              console.log('woID не найден в URL.');
          } else {
              console.log(`woID найден: ${woID}`);
          }
      }
  });
});
