var React = require('react');
var fs = require('fs');
var setting = JSON.parse(fs.readFileSync("config.json", 'utf8')); 

/*
 * Redmine URLの入力フォームを生成
 * @return {object} urlのinputオブジェクト
 */
var RedmineUrl = React.createClass({displayName: "RedmineUrl",
  // URLの更新により発生
  handleChange: function(e) {
    console.log("info:IssueSubject handleChange");
    var redmine_url = React.findDOMNode(this.refs.redmine_url).value.trim();
    this.props.onRedmineUrlChange({redmine_url: redmine_url});
    return;
    },
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {htmlFor: "redmine-url", className: "col-md-4 control-label"}, "redmine URL"), 
        React.createElement("div", {className: "col-md-8"}, 
          React.createElement("input", {type: "url", className: "form-control", id: "redmine-url", placeholder: "http://sample.com/redmine", ref: "redmine_url", onChange: this.handleChange})
        )
      )
    );
  }
});

/*
 * Redmineアカウントの入力フォームを生成
 * @return {object} Settingのformオブジェクト
 */
var SettingForm = React.createClass({displayName: "SettingForm",
  /*
   *  Projectを変更したときに発生
   */
  handleSettingSave: function(setting) {
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
  },
  /*
   * Descriptionを変更したときに発生 
   */
  handleRedmineUrlChange: function(description) {
    this.setState({description: description});
  },
  /*
   * Subjectを変更したときに発生 
   */
  handleSubjectChange: function(subject) {
    this.setState({ subject: subject});
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
  },
  render: function() {
    return (
      React.createElement("form", {className: "form-vertical", role: "form"}, 
        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Redmine setting"), 
          React.createElement(RedmineUrl, null), 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {for: "apikey", className: "col-md-4 control-label"}, "API Key"), 
            React.createElement("div", {className: "col-md-8"}, 
              React.createElement("input", {type: "password", className: "form-control", id: "apikey"})
            )
          ), 

          React.createElement("div", {className: "form-group"}, 
            React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
              React.createElement("button", {type: "button", className: "btn btn-primary", id: "save", "data-toggle": "modal", "data-target": "#saveModal"}, "Save")
            )
          )
        )
      )
    );
  }
});

React.render(
  React.createElement(SettingForm, null),
  document.getElementById('setting_view')
);
