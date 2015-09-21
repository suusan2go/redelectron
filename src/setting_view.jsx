var React = require('react');
var fs = require('fs');
var setting = JSON.parse(fs.readFileSync("config.json", 'utf8')); 

/*
 * Redmine URLの入力フォームを生成
 * @return {object} urlのinputオブジェクト
 */
var RedmineUrl = React.createClass({
  // URLの更新により発生
  handleChange: function(e) {
    console.log("info:Redmine URL handleChange");
    var redmine_url = React.findDOMNode(this.refs.redmine_url).value.trim();
    this.props.onRedmineUrlChange({redmine_url: redmine_url});
    return;
  },
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="redmine-url" className="col-md-4 control-label">redmine URL</label>
        <div className="col-md-8">
          <input type="url" className="form-control" id="redmine-url" placeholder="http://sample.com/redmine" ref="redmine_url" onChange={this.handleChange}></input>
        </div>
      </div>
    );
  }
});

/*
 * Redmine Api Keyの入力フォーム
 * @return {object} urlのinputオブジェクト
 */
var RedmineApiKey = React.createClass({
  // Redmine API KEYの変更により発生
  handleChange: function(e) {
    console.log("info:Redmine API KEY handleChange");
    var redmine_api_key = React.findDOMNode(this.refs.redmine_api_key).value.trim();
    this.props.onRedmineApuKeyChange({redmine_api_key: redmine_api_key});
    return;
  },
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="apikey" className="col-md-4 control-label">API Key</label>
        <div className="col-md-8">
          <input type="password" className="form-control" id="apikey" ref="redmine_api_key" onChange={this.handleChange}></input >
        </div>
      </div>
    );
});

/*
 * Redmineアカウントの入力フォームを生成
 * @return {object} Settingのformオブジェクト
 */
var SettingForm = React.createClass({
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
      <form className="form-vertical" role="form">  
        <fieldset>
          <legend>Redmine setting</legend>
          <RedmineUrl />
          <RedmineApiKey />

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="button"  className="btn btn-primary" id="save" data-toggle="modal" data-target="#saveModal">Save</button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
});

React.render(
  <SettingForm />,
  document.getElementById('setting_view')
);
