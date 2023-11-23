import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StyleSheet, Text, View,Button } from 'react-native';
import moment from 'moment';
const DateTimePicker = ({
  isVisible,
  setVisible,
  date,
  setDate
}) => {
  const hideDatePicker = () => {
    setVisible()
  };

  const handleConfirm = (currentDate) => {
    hideDatePicker();
    setDate(moment(currentDate).format('YYYY-MM-DD'))
  };
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      date={moment(date).toDate()}
    />
  );
}

export default DateTimePicker

const styles = StyleSheet.create({})