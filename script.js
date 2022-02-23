import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

export const ErrorCount = new Counter('Errors');

export const options = {
        vus : 10,
        duration : "10s",
        thresholds : {
                http_req_failed: ['rate<0.01'],
                Errors : ['count<100'],
        },
};

export default function() {
        const res = http.get('http://test.k6.io');
        let success = check(res, {
                'status is 200': (r) => r.status === 200
        });
        ErrorCount.add(1);
}
