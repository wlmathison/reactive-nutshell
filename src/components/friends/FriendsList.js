import React, { Component } from "react";
import "./friends.css";
import { Container, Form, Button } from "reactstrap";
import API from "../../modules/APICaller";
import FriendCard from "./FriendCard";
import UserCard from "./UserCard";

export default class Friends extends Component {
  state = {
    allUsers: [],
    myFriends: [],
    value: [],
    searchUser: []
  };

  componentDidMount() {
    API.getAll(
      `connections?userId=${this.props.activeUser}&_expand=friend`
    ).then(array => {
      this.setState({ myFriends: array });
    });

    API.getAll("friends").then(allUsers => {
      this.setState({ allUsers: allUsers });
    });
  }

  handleRemoveFriend = event => {
    const target = event.target.id;
    this.props.removeFriend(target);
  };

  handleAddFriend = event => {
    let friendId = event.target.id;
    if (
      !this.state.myFriends.find(friend => friend.friendId == friendId) &&
      friendId != this.props.activeUser
    ) {
      this.props.addFriend(friendId);
    } else {
      alert("You are already friends!");
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.friends !== this.props.friends) {
      API.getAll(
        `connections?userId=${this.props.activeUser}&_expand=friend`
      ).then(array => {
        this.setState({ myFriends: array });
      });
    }
  }


  handleSubmit = event => {
    event.preventDefault();
    let searchUser = this.state.allUsers.filter(user => {
      let username = user.userName.toLowerCase();
      return (
        username.includes(this.state.value) && user.id != this.props.activeUser
      );
    });
    this.setState({ searchUser: searchUser });
    if (event.type === "click") {
      let form = event.target.parentNode;
      form.reset();
    } else {
      let form = event.target;
      form.reset();
    }
  };



  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div>
        <Container>
          <div className="friends-list container">
            <h1 className="header">Your Friends</h1>
            {this.state.myFriends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                removeFriend={this.handleRemoveFriend}
              />
            ))}
          </div>
          
          <div className="user-list container">
          <Form
            onSubmit={this.handleSubmit}
            className="form-inline"
          >
            <label>
              Search:
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control "
              />
            </label>
            <Button type="button" onClick={this.handleSubmit} value="Submit">
              Find User
            </Button>
          </Form>

            {this.state.searchUser.map(user => (
              <UserCard
                key={user.id}
                user={user}
                addFriend={this.handleAddFriend}
              />
            ))}
          </div>
        </Container>
      </div>
    );
  }
}
