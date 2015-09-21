/*
 * suzan2go
 * New Issue 画面
 */

// load redmine url and api keys
var React =require('react');
var RedmineApi = require('./lib/redmine_api.js');
var fs = require('fs');
var setting = JSON.parse(fs.readFileSync("config.json", 'utf8')); 

/*
 * Project一覧のselectオブジェクトを生成 
 * @return {object} selectタグのオブジェクト
 */
var ProjectList = React.createClass({displayName: "ProjectList",
  /*
   * プロジェクト選択されたときに発生
   */
  handleChange: function(e) {
    console.log("info:handleChange");
    e.preventDefault();
    var projectid = event.target.value;
    if (!projectid) {
      return;
    }
    this.props.onProjectChange({identifier: projectid});
    // set selected state 
    React.findDOMNode(this.refs.project).value = projectid;
    return;
  },
  render: function() {
    var ProjectNodes = this.props.data.map(function (project) {
      return (
        React.createElement("option", {value: project.identifier}, 
          project.name
        )
      );
    });
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "projects", className: "col-xs-4 control-label"}, "Project"), 
        React.createElement("div", {className: "col-xs-8"}, 
          React.createElement("select", {className: "form-control", ref: "project", onChange: this.handleChange}, 
            ProjectNodes
          )
        )
      )
    );
  }
});

/*
 * Issueの説明オブジェクトを生成 
 * @return {object} Issueのdescription textareaオブジェクト
 */
var IssueDescription = React.createClass({displayName: "IssueDescription",
  // descriptionが更新により発生
  handleChange: function(e) {
    console.log("info:IssueDescription handleChange");
    var description = React.findDOMNode(this.refs.description).value.trim();
    this.props.onDescriptionChange({description: description});
    return;
  },
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "memo", className: "col-sm-4 control-label"}, "Description"), 
        React.createElement("div", {className: "col-sm-4"}, 
          React.createElement("textarea", {className: "form-control", id: "memo", rows: "3", onChange: this.handleChange, ref: "description"})
        )
      )
    );
  }
});

/*
 * Issueのタイトルオブジェクトを生成 
 * @return {object} Issueのsubject inputオブジェクト
 */
var IssueSubject = React.createClass({displayName: "IssueSubject",
  // subjectの更新により発生
  handleChange: function(e) {
    console.log("info:IssueSubject handleChange");
    var subject = React.findDOMNode(this.refs.subject).value.trim();
    this.props.onSubjectChange({subject: subject});
    return;
  },
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "subject", className: "col-sm-4 control-label"}, "subject"), 
        React.createElement("div", {className: "required col-sm-8"}, 
          React.createElement("input", {type: "text", className: "form-control", id: "subject", 
            placeholder: "", ref: "subject", onChange: this.handleChange})
        )
      )
    );
  }
});

/*
 * Issueの期日オブジェクトを生成 
 * @return {object} IssueのDueDate inputオブジェクト
 */
var DueDate = React.createClass({displayName: "DueDate",
  // subjectの更新により発生
  handleChange: function(e) {
    console.log("info:DueDate handleChange");
    var duedate = React.findDOMNode(this.refs.duedate).value.trim();
    this.props.onSubjectChange({ duedate: duedate });
    return;
  },
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "date", className: "col-xs-4 control-label"}, "DueDate"), 
        React.createElement("div", {className: "col-xs-8"}, 
          React.createElement("input", {type: "date", className: "form-control", id: "date", ref: "due_date", onChange: this.handleChange})
        )
      )
    );
  }
});

/*
 * Issueの担当者オブジェクトを生成 
 * @return {object} IssueのMember selectオブジェクト
 */
var MemberList = React.createClass({displayName: "MemberList",
  handleChange: function(e) {
    console.log("info:MemberList handleChange");
    var memberid = React.findDOMNode(this.refs.member).value;
    this.props.onMemberChange( { user: {id: memberid} });
    React.findDOMNode(this.refs.member).value = memberid;
    return;
  },
  render: function() {
    var MemberNodes = this.props.data.map(function (member) {
      // only user (not group)
      if(!member.user) return;
      return (
        React.createElement("option", {value: member.user.id}, 
          member.user.name
        )
      );
    });
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "members", className: "col-xs-4 control-label"}, "Assignee"), 
        React.createElement("div", {className: "col-xs-8"}, 
          React.createElement("select", {id: "members", className: "form-control", ref: "member", onChange: this.handleChange}, 
            MemberNodes
          )
        )
      )
    );
  }
});

/*
 * Issueのトラッカーオブジェクトを生成 
 * @return {object} Issueのtracker selectオブジェクト
 */
var TrackerList = React.createClass({displayName: "TrackerList",
  handleChange: function(e) {
    console.log("info:TrackerList handleChange");
    var trackerid = React.findDOMNode(this.refs.tracker).value;
    this.props.onTrackerChange( {id: trackerid} );
    React.findDOMNode(this.refs.tracker).value = trackerid;
    return;
  },
  render: function() {
    var TrackerNodes = this.props.data.map(function (tracker) {
      return (
        React.createElement("option", {value: tracker.id}, 
          tracker.name
        )
      );
    });
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "trackers", className: "col-xs-4 control-label"}, "Tracker"), 
        React.createElement("div", {className: "col-xs-8"}, 
          React.createElement("select", {id: "trackers", className: "form-control", ref: "tracker", onChange: this.handleChange}, 
            TrackerNodes
          )
        )
      )
    );
  }
});

/*
 * Issueをcreateしたときのモーダルを生成 
 * @return {object} Modalを生成
 */
var ResultModal = React.createClass({displayName: "ResultModal",
  render: function() {
    return (
      React.createElement("div", {className: "modal-dialog"}, 
        React.createElement("div", {className: "modal-content"}, 
          React.createElement("div", {className: "modal-header"}
          ), 
          React.createElement("div", {className: "modal-body"}, 
            React.createElement("div", {className: "primary"}, 
              React.createElement("p", {className: "text-success", id: "result"}, "result")
            )
          ), 
          React.createElement("div", {className: "modal-footer"}, 
            React.createElement("button", {className: "btn", "data-dismiss": "modal", "aria-hidden": "true"}, "close")
          )
        )
      )
    );
  }
});

/*
 * Settingタブでredmine url , api keyを設定した後のモーダル
 * @return {object} Modalを生成
 */
var LoadModal = React.createClass({displayName: "LoadModal",
  render: function() {
    return (
      React.createElement("div", {className: "modal-dialog"}, 
        React.createElement("div", {className: "modal-content"}, 
          React.createElement("div", {className: "modal-header"}, "Loading..."), 
          React.createElement("div", {className: "modal-body"}, 
            React.createElement("div", {className: "progress"}, 
              React.createElement("div", {className: "progress-bar progress-bar-striped active", role: "progressbar", "aria-valuenow": "100", "aria-valuemin": "0", "aria-valuemax": "100", style: {width: 100}}, 
                React.createElement("span", {className: "sr-only"})
              )
            )
          )
        )
      )
    );
  }
});

/*
 * Issueの入力フォームを生成
 * @return {object} Issueのformオブジェクト
 */
var IssueForm = React.createClass({displayName: "IssueForm",
  /*
   *  Projectを変更したときに発生
   */
  handleProjectChange: function(project) {
    var _this = this; 
    var projectid = project.identifier;
    /*
     * Projectの情報をsetする
     */
    this.setState({selectproject: project});   
    /*
     *  projectに設定されたユーザー情報を取得
     *  user,group,roleを取得するが、使用するのはuserのみ
     */
    RedmineApi.getMembers(setting.url, setting.apikey, projectid).done(function(member_data){
      _this.setState({members: member_data.memberships});
    });

    /*
     *  projectに設定されたトラッカーを取得
     */
    RedmineApi.getTrackers(setting.url, setting.apikey, projectid).done(function(tracker_data){
      _this.setState({trackers: tracker_data.project.trackers});
    });
  },
  /*
   * Descriptionを変更したときに発生 
   */
  handleDescriptionChange: function(description) {
    this.setState({description: description});
  },
  /*
   * Subjectを変更したときに発生 
   */
  handleSubjectChange: function(subject) {
    this.setState({ subject: subject});
  },
  /*
   * DueDateを変更したときに発生 
   */
  handleDueDateChange: function(duedate) {
    this.setState({ duedate: duedate});
  },
  /*
   * Memberを変更したときに発生 
   */
  handleMemberChange: function(member) {
    //this.setState({ member: member});
    this.setState({ selectmember: member});
  },
  /*
   * Trackerを変更したときに発生 
   */
  handleTrackerChange: function(tracker) {
    this.setState({ selecttracker: tracker});
  },
  /*
   *  propsを初期化
   */
  getInitialState: function() {
    return {projects: [],trackers: [],members: [],duedate: '',subject: '', description: ''};
  },
  /*
   *  描画後の初期値を設定
   */
  componentDidMount: function() {
    var _this = this; 
    /*
     *  redmineからprojectを取得
     *  ※apikeyを設定したアカウントから閲覧可能なプロジェクトのみ
     */
    RedmineApi.getProjects(setting.url,setting.apikey).done(function(project_data){
      _this.setState({projects: project_data.projects});

      //プロジェクトの最初のIDを設定する。
      var projectid = project_data.projects[0].identifier;

      /*
       *  projectに設定されたユーザー情報を取得
       *  user,group,roleを取得するが、使用するのはuserのみ
       */
      RedmineApi.getMembers(setting.url, setting.apikey, projectid).done(function(member_data){
        _this.setState({members: member_data.memberships});
      });

      /*
       *  projectに設定されたトラッカーを取得
       */
      RedmineApi.getTrackers(setting.url, setting.apikey, projectid).done(function(tracker_data){
        _this.setState({trackers: tracker_data.project.trackers});
      });
    });
  },
  render: function() {
    return (
      React.createElement("div", {className: "IssueForm"}, 
        React.createElement("form", {className: "form-horizontal", id: "#container", role: "form"}, 
          React.createElement("fieldset", null, 
            React.createElement("legend", null, "New Issue"), 
            React.createElement(ProjectList, {data: this.state.projects, onProjectChange: this.handleProjectChange}), 
            React.createElement(TrackerList, {data: this.state.trackers, onTrackerChange: this.handleTrackerChange}), 
            React.createElement(MemberList, {data: this.state.members, onMemberChange: this.handleMemberChange}), 
            React.createElement(DueDate, {onDueDateChange: this.handleDueDateChange}), 
            React.createElement(IssueSubject, {onSubjectChange: this.handleSubjectChange}), 
            React.createElement(IssueDescription, {onDescriptionChange: this.handleDescriptionChange}), 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
                React.createElement("button", {type: "button", className: "btn btn-primary", id: "postIssue", 
                  "data-toggle": "modal", "data-target": "#resultModal"}, "Create")
              )
            )
          )
        ), 
        React.createElement("div", {className: "modal fade", id: "resultModal", tabIndex: "-1", role: "dialog", "aria-labelledby": "myModalLabel", "aria-hidden": "true"}, 
          React.createElement(ResultModal, null)
        ), 

        React.createElement("div", {className: "modal fade", id: "loadModal", tabIndex: "-1", role: "dialog", "aria-labelledby": "myModalLabel", "aria-hidden": "true"}, 
          React.createElement(LoadModal, null)
        )
      )
    );
  }
});

React.render(
  React.createElement(IssueForm, null),
  document.getElementById('create_issue_view')
);
