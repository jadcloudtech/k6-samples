import http from 'k6/http';
import { check,sleep } from 'k6';
import { Counter,Trend,Gauge } from 'k6/metrics';

export const CountError = new Counter('Errors');
export const TrendRTT   = new Trend ('RTT');
export const GaugeContentSize = new Gauge ('ContentSize');

export const options = {
	scenarios: {
		sample_scenario: {
			executor: 'shared-iterations',
			startTime: '5s',
			vus : 10,
			iterations: 100,
			maxDuration : '5s',
		},
	},
        thresholds : {
                http_req_failed: ['rate<0.01'],
                Errors : ['count<200'],
		RTT : ['p(95)<300' , 'avg<300' , 'med<250' , 'min<100'],
		ContentSize :['value<4000'],
	},
};

export default function() {
        const res = http.get('http://test.k6.io');
        check(res, {
                'status is 200': (r) => r.status === 200
        });
        CountError.add(1);
	TrendRTT.add(res.timings.duration);
	GaugeContentSize.add(res.body.length);

sleep(1);
}

