export const controlEmptiness = (inputs) => {
  const response = {};
  for(const input in inputs){
    response[input+"Error"] = inputs[input].length <= 0 ? "Bu alan boş bırakılamaz!" : false; 
  }
  return response;
}

export const validateSummary = (summary) => {
  return { summaryError: summary.length >= 50 ? false : 'Özet en az 50 karakter uzunluğunda olmalıdır!' }
}

export const validateLabelsOnChange = (labels) => {
  return { labelsError: labels.length > 5 ? 'Bir anlatıma en fazla 5 etiket eklenebilir.' : false }
}

export const validateLabels = (labels) => {
  return { 
    labelsError: labels.length > 5 
    ? 'Bir anlatıma en fazla 5 etiket eklenebilir.'
    : labels.includes(" ") ? 'Etiket başlıkları en az 1 karakter içermek zorundadır!' : false
  }
}
