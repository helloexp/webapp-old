
/**
 * This function get's the JSC_DATA value to send to GDS
 * when creating the order.
 */
export function getJscData() {
  const service = window.jpparm1;

  if (service) {
    return service.jpcall();
  }

  return null;
}
