//3rd's
import React, { Component } from 'react'
import { push } from 'connected-react-router';
import { connect } from 'react-redux'

// actions
import { getPlan, initLoading, clearPlan, clearPlans, update, save, remove } from '../actions/plans';
import { apiSource, getApiSourceByName, clearApiSource, fetchingApi } from '../actions/apis';

//components
import { Card, Row } from 'antd'
import PageHeader from '../components/ui/PageHeader'
import Loading from '../components/ui/Loading'
import PlanForm from '../components/plans/PlanForm';
import { isEmpty } from '../utils/CommonUtils';
import moment from 'moment'

class SinglePlan extends Component {

    state = { loadEntity: false, timer: Date.now(), intervalSeconds: 2 }

    componentDidMount() {
        let idPlan = this.props.match.params.id
        if (idPlan) {
            this.props.dispatch(getPlan(idPlan))
            this.setState({ ...this.state, loadEntity: true })
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.plan && newProps.plan !== this.props.plan) {
            this.props.dispatch(apiSource([newProps.plan.api]))
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearPlan())
        this.props.dispatch(clearApiSource())
    }

    handleSearch = (searchObject) => {
        if (searchObject && !isEmpty(searchObject) && searchObject.length > 3) {
            var duration = moment.duration(moment().diff(this.state.timer));
            var seconds = duration.asSeconds();
            if (seconds > this.state.intervalSeconds) {
                this.setState({ ...this.state, timer: Date.now() })
                this.props.dispatch(clearApiSource())
                this.props.dispatch(fetchingApi())
                this.props.dispatch(getApiSourceByName(searchObject))
            }
        }
    }

    handleSubmit = (formObject) => {
        this.props.dispatch(initLoading())
        if (formObject.id) {
            this.props.dispatch(clearPlan())
            this.props.dispatch(update(formObject))
        } else {
            this.props.dispatch(save(formObject))
        }
    }

    handleDelete = (planId) => {
        this.props.dispatch(remove(planId))
        this.props.dispatch(clearPlans())
        this.props.dispatch(push('/plans'))
    }

    render() {
        const { plan } = this.props

        if (this.state.loadEntity && !plan) return <Loading />
        const title = plan ? 'Edit' : 'Add'
        const { apiSource } = this.props

        return (
            <div>
                <PageHeader title="Plans" icon="profile" />
                <Row className="h-row bg-white">
                    <Card style={{ width: '100%' }} title={title + ' Plan'}>
                        <PlanForm plan={plan}
                            handleDelete={this.handleDelete}
                            handleSubmit={this.handleSubmit}
                            handleSearch={this.handleSearch}
                            loading={this.props.loading}
                            apiSource={apiSource}
                            fetching={this.props.fetching} />
                    </Card>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        plan: state.plans.plan,
        loading: state.plans.loading,
        apiSource: state.apis.apiSource,
        fetching: state.apis.fetching
    }
}

export default connect(mapStateToProps)(SinglePlan)