import { redirect } from 'utils/routing';

export const cupValues = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
export const cupUnderValues = ['65', '70', '75', '80', '85', '90', '95', '100', '105', '110', '115', '120'];

export function navigateMySize(path) {
  redirect(`mysize/${path}`);
}
