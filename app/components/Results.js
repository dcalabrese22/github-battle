import React from "react";
import {battle} from "../utils/api";
import {FaBriefcase, FaCompass, FaUser, FaUsers} from "react-icons/fa";
import Card from "./Card";
import PropTypes from "prop-types";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import {Link} from "react-router-dom";
import queryString from 'query-string'


function ProfileList({profile}) {
    return (
        <ul className="card-list">
            <li>
                <FaUser color="rgb(239,115,115)" size={22}/>
                {profile.profile.name}
            </li>
            {profile.profile.location && (
                <li>
                    <Tooltip text="User's location">
                        <FaCompass color="rgb(144,115,255)" size={22}/>
                        {profile.profile.location}
                    </Tooltip>
                </li>
            )}
            {profile.profile.company && (
                <li>
                    <Tooltip text="User's company">
                        <FaBriefcase color="#795548" size={22}/>
                        {profile.profile.company}
                    </Tooltip>
                </li>
            )}
            <li>
                <FaUsers color="rgb(129,195,245)" size={22}/>
                {profile.profile.followers.toLocaleString()} followers
            </li>
            <li>
                <FaUsers color="rgb(64,183,95)" size={22}/>
                {profile.profile.following.toLocaleString()} following
            </li>
        </ul>
    )
}

ProfileList.propTypes = {
    profile: PropTypes.object.isRequired
}

export default class Results extends React.Component {

    state = {
        winner: null,
        loser: null,
        error: null,
        loading: true
    }

    componentDidMount() {
        const {playerOne, playerTwo} = queryString.parse(this.props.location.search)

        battle([playerOne, playerTwo])
            .then((players) => {
                this.setState({
                    winner: players[0],
                    loser: players[1],
                    error: null,
                    loading: false
                })
            })
            .catch(({message}) => {
                this.setState({
                    error: message,
                    loading: false
                })
            })
    }

    render() {
        const {winner, loser, error, loading} = this.state

        if (loading === true) {
            return <Loading/>
        }

        if (error) {
            return (
                <p className="center-text error">{error}</p>
            )
        }

        return (
            <React.Fragment>
                <div className="grid space-around container-sm">
                    <Card href={winner.profile.html_url}
                          avatar={winner.profile.avatar_url}
                          name={winner.profile.login}
                          header={winner.score === loser.score ? "Tie" : "Winner"}
                          subheader={`Score: ${winner.score.toLocaleString()}`}>

                        <ProfileList profile={winner}/>
                    </Card>

                    <Card
                        href={loser.profile.html_url}
                        avatar={loser.profile.avatar_url}
                        name={loser.profile.login}
                        header={winner.score === loser.score ? "Tie" : "Loser"}
                        subheader={`Score: ${loser.score.toLocaleString()}`}>

                        <ProfileList profile={loser}/>
                    </Card>

                </div>

                <Link
                    className="btn dark-btn btn-space"
                    to={"/battle"}
                >
                    Reset
                </Link>
            </React.Fragment>
        )
    }

}