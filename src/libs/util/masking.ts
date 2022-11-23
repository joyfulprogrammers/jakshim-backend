export const masking = (value: any, mask = '**') =>
  `${mask}${value.toString().slice(2)}`;
