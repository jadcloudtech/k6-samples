import http from 'k6/http';
import { check , sleep } from 'k6';

export const options = {
        thresholds: {
                http_req_receiving: ['p(90) < 300'],
                http_req_connecting: ['p(90) < 500'],
                http_req_duartion: ['p(90) < 200', 'p(95) < 200'],
        },
};

export default function () {
  const res =  http.get('https://test-api.k6.io/');
  console.log('Response time was ' + String(res.timings.duration) + ' ms');
  check(res, {
          'is status 200': (r) => r.status === 200,
  });
 sleep(1);
}
