---
title: "[Airflow] 에러 발생시 Slack으로 알림 주기"
categories: [데이터엔지니어링]
tags: [airflow, data-engineering, slack]
mermaid: true
math: true
comments: true
pin: false
image:
  path:
  width:
  height:
  alt:
---

### Slack Token 생성

* <https://api.slack.com/custom-integrations/legacy-tokens>

### airflow slack operator

```sh
pip install apache-airflow-providers-slack
```

```python
from airflow.operators.slack_operator import SlackAPIPostOperator
SlackAPIPostOperator(
    task_id='failure',
    token='TOKEN',
    text='Hello World !',
    channel='real-estate',  # Replace with your Slack username
    username='airflow'
)
```

![](/assets/2021-11/airflow_connection.png)

* `airflows UI > Admin > Connections`
  * `Conn Type`: HTTP
  * `Host:` https://hooks.slack.com/services/
  * `Password`: services/`PASSWORD` (services의 하위를 패스워드에 입력)

### Code

![](/assets/2021-11/slack_msg.png)

```python
from airflow.hooks.base_hook import BaseHook
from airflow.contrib.operators.slack_webhook_operator import SlackWebhookOperator

SLACK_CONN_ID = 'slack'
def task_fail_slack_alert(context):
    slack_webhook_token = BaseHook.get_connection(SLACK_CONN_ID).password
    slack_msg = """
            :red_circle: Task Failed. 
            *Task*: {task}  
            *Dag*: {dag} 
            *Execution Time*: {exec_date}  
            *Log Url*: {log_url} 
            """.format(
            task=context.get('task_instance').task_id,
            dag=context.get('task_instance').dag_id,
            ti=context.get('task_instance'),
            exec_date=context.get('execution_date'),
            log_url=context.get('task_instance').log_url,
        )
    failed_alert = SlackWebhookOperator(
        task_id='slack_test',
        http_conn_id='slack',
        webhook_token=slack_webhook_token,
        message=slack_msg,
        username='airflow')
    return failed_alert.execute(context=context)
```

```python
args = {
    'owner': 'airflow',
    'on_failure_callback': slack_failed_callback
}

with DAG(
    dag_id='slack',
    default_args=args,
```


* 참고
  * <https://medium.com/datareply/integrating-slack-alerts-in-airflow-c9dcd155105>
  * <https://github.com/apache/airflow/blob/main/airflow/providers/slack/example_dags/example_slack.py>
  * <https://airflow.apache.org/docs/apache-airflow-providers-slack/stable/_api/airflow/providers/slack/operators/slack/index.html#module-airflow.providers.slack.operators.slack>