const repository = require('../repositories/document.repository')

const getData = async (changedate = null) => {
  let responseDocument = await repository.acquireData(changedate ? changedate : null);

  if (responseDocument.data.length != 0) {
    let responseDocumentFiltered = responseDocument.data;

    // bersihkan data Document
    if (typeof responseDocumentFiltered == "string") {
      const removeBacklashDoc = responseDocumentFiltered.replaceAll(/\\/g, "");
      responseDocumentFiltered = JSON.parse(removeBacklashDoc);
    }

    // cek duplikasi data
    const uniqueArrayDoc = responseDocumentFiltered.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        responseDocumentFiltered.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });
    return uniqueArrayDoc
  } else {
    return []
  }
}

module.exports = {
  getData
}