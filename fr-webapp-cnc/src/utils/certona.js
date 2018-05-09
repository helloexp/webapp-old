let certonaInProgress = false;

function resetFlagAndHandle(resolve, recommendations) {
  certonaInProgress = false;
  resolve(recommendations);
}

export function loadCertonaItems(type, info) {
  const infoObj = {
    ...info,
    pagetype: type,
    recommendations: true,
    callback: 'boundCertonaCB',
  };

  return new Promise((resolve) => {
    function handle() {
      certonaInProgress = true;
      window.boundCertonaCB = resetFlagAndHandle.bind(null, resolve);
      if (window.certonaRun) {
        window.certonaRun({
          ...infoObj,
        });
      }
    }

    function reCheck() {
      setTimeout(() => {
        if (certonaInProgress) {
          reCheck();
        } else {
          handle();
        }
      }, 500);
    }

    if (certonaInProgress) {
      reCheck();
    } else {
      handle();
    }
  });
}
