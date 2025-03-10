const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { metrics } = require('@opentelemetry/api');
const { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics'); 


const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const traceExporterOptions = {
  url: 'https://ingest.in.signoz.cloud:443/v1/traces'
}

const metricExporterOptions = {
  url: 'https://ingest.in.signoz.cloud:443/v1/metrics'
}

const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter(metricExporterOptions),
  // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
  exportIntervalMillis: 10000,
});

// By default exports the metrics on localhost:9464/metrics
const prometheus = new PrometheusExporter();

const sdk = new NodeSDK({
  // You can add a traceExporter field here too
  metricReader: metricReader,
  traceExporter: new OTLPTraceExporter(traceExporterOptions),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
