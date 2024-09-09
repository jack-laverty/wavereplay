import dayjs from 'dayjs';

export const readEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
};

export const formatDateTime = (date: string, time: string): [string, string] => {
  const dateTime = dayjs(`${date} ${time}`);
  const formattedDate = dateTime.format('D MMM YYYY');
  const formattedTime = dateTime.format('h:mma');
  return [formattedDate, formattedTime]
}

export const formatTime = (time: string): string => {
  const dateTime = dayjs(`2024-01-01 ${time}`);
  const formattedTime = dateTime.format('h:mma');
  return formattedTime
}
