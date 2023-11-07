function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setTitle('Komunitas Kami Pengajar')
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('dbkp');
  var dataRange = sheet.getRange('A5:Y' + sheet.getLastRow());
  var data = dataRange.getValues();
  var jsonData = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var rowData = {
      'noAnggota': row[0],
      'nama': row[1],
      'instansi': row[2],
      'provinsi': row[3],
      'kotaKabupaten': row[4],
      'regional': row[5],
      'jenjang': row[6],
      'statusKepegawaian': row[7],
      'wa': row[8],
      'email': row[9],
      'jenisKelamin': row[10],
      'agama': row[11],
      'tempatLahir': row[12],
      'tanggalLahir': row[13],
      'nuptk': row[14],
      'nip': row[15],
      'disabilitas': row[16],
      'jenisDisabilitas': row[17],
      'interest': row[18],
      'harapan': row[19],
      'darimana': row[20],
      'medsos': row[21],
      'followers': row[22],
      'foto': row[23],
      'sandi': row[24]
    };
    jsonData.push(rowData);
  }

  console.log(jsonData); // Menggunakan Logger.log untuk menampilkan data ke log
  return jsonData;
}



function editCustomerById(id, infoAnggota) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("dbkp");
  const data = ws.getRange(5, 1, ws.getLastRow() - 4, 1).getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === id) {
      const rowNumber = i + 5;
      const rowData = [
        infoAnggota.noAnggota,
        infoAnggota.nama,
        infoAnggota.instansi,
        infoAnggota.provinsi,
        infoAnggota.kotaKabupaten,
        infoAnggota.regional,
        infoAnggota.jenjang,
        infoAnggota.statusKepegawaian,
        infoAnggota.wa,
        infoAnggota.email,
        infoAnggota.jenisKelamin,
        infoAnggota.agama,
        infoAnggota.tempatLahir,
        infoAnggota.tanggalLahir,
        infoAnggota.nuptk,
        infoAnggota.nip,
        infoAnggota.disabilitas,
        infoAnggota.jenisDisabilitas,
        infoAnggota.interest,
        infoAnggota.harapan,
        infoAnggota.darimana,
        infoAnggota.medsos,
        infoAnggota.followers,
        infoAnggota.foto,
        infoAnggota.sandi,
      ];

      // Memasukkan setiap elemen JSON ke dalam sel yang sesuai
      ws.getRange(rowNumber, 1, 1, rowData.length).setValues([rowData]);

      return true;
    }
  }

  return false; // Jika id tidak ditemukan
}

function deleteRecord(props){
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ws = ss.getSheetByName('dbkp')
  const idCellMatched = ws.getRange("A5:A").createTextFinder(props.id).matchEntireCell(true).matchCase(true).findNext()
  
  if(idCellMatched === null) throw new Error("No matching record")
 
  const recordRowNumber = idCellMatched.getRow()
 
  ws.deleteRow(recordRowNumber)
  
  return true
}

function addRecord(
  testName, 
  instansi,
  provinsi,
  kotaKabupaten,
  regional,
  jenjang,
  statusKepegawaian,
  wa,
  email,
  jenisKelamin,
  agama,
  tempatLahir,
  tanggalLahir,
  nuptk,
  nip,
  disabilitas,
  jenisDisabilitas,
  interest,
  harapan,
  darimana,
  medsos,
  followers,
  foto,
  sandi,
  ) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName('dbkp');

  // Buat ID baru
  const newId = generateNewId(ws);

  // Tambahkan data baru ke lembar kerja
  ws.appendRow([
    newId,
    testName, 
    instansi,
    provinsi,
    kotaKabupaten,
    regional,
    jenjang,
    statusKepegawaian,
    wa,
    email,
    jenisKelamin,
    agama,
    tempatLahir,
    tanggalLahir,
    nuptk,
    nip,
    disabilitas,
    jenisDisabilitas,
    interest,
    harapan,
    darimana,
    medsos,
    followers,
    foto,
    sandi,
  ]);

console.log(newId)
  return newId;
}

function generateNewId(sheet) {
  const data = sheet.getRange("A5:A" + sheet.getLastRow()).getValues();
  const existingIds = data.flat().filter(Boolean);
  let newId = null;

  do {
    // Ambil tahun saat ini
    const currentYear = new Date().getFullYear();

    // Cari nomor urut terbesar dan tambahkan 1
    const lastRecordNumber = existingIds
      .filter(id => id.startsWith("KP-" + currentYear + "-"))
      .map(id => parseInt(id.split("-")[2]))
      .reduce((max, number) => (number > max ? number : max), 0);
    const newRecordNumber = lastRecordNumber + 1;

    // Format ID baru dengan 'KP-tahun record-nomor urut'
    newId = `KP-${currentYear}-${newRecordNumber.toString().padStart(6, "0")}`;
  } while (existingIds.includes(newId));

  return newId;
}

function getPasswordForEdit(idAnggota) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { // Mulai dari baris kedua (asumsi baris pertama adalah header)
    if (data[i][0] === idAnggota) {
      // Mengembalikan kata sandi dari kolom Y
      return data[i][24]; // Y adalah indeks kolom 24 (kolom Y)
    }
  }
  return null; // Jika idAnggota tidak ditemukan
}
