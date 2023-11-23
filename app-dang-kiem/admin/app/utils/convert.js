exports.convertMoney = (money) => {
  return money.replaceAll(".", "").replaceAll(",", "").replaceAll("đ", "");
};
exports.convertCar = (car) => {
  return car.replaceAll("-", "").replaceAll(" ", "");
};

exports.convertLicensePlate = (license_plate) => {
  if (isNaN(license_plate[3]))
    return license_plate
      ? license_plate.slice(0, 4) + " - " + license_plate.slice(4, license_plate.length)
      : "";
  else
    return license_plate
      ? license_plate.slice(0, 3) + " - " + license_plate.slice(3, license_plate.length)
      : "";
};
exports.dateConvert = (d) => {
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};
exports.dateConvert1 = (d) => {
  if (d !== undefined) {
    const date = d.split("-");
    return `${date[0]}`;
  } else {
    return "";
  }
};

exports.dateConvertSQL = (d) => {
  const date = d.split("/");
  return `${date[2]}-${date[1]}-${date[0]}`;
};
exports.dateConvertSQL1 = (d) => {
  if (d !== undefined) {
    const date = d.split("/");
    return `${date[2]}-${date[1]}-${date[0]}`;
  } else {
    return "";
  }
};
exports.filterDateStartConvertSQL = (d) => {
  if (d !== undefined) {
    const date = d.split(" - ");
    const start = date[0].split("/");
    return `${start[2]}-${start[1]}-${start[0]}`;
  } else {
    return "";
  }
};
exports.filterDateEndConvertSQL = (d) => {
  if (d !== undefined) {
    const date = d.split(" - ");
    const start = date[1].split("/");
    return `${start[2]}-${start[1]}-${start[0]}`;
  } else {
    return "";
  }
};
