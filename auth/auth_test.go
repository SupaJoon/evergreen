package auth

import (
	"testing"

	"github.com/evergreen-ci/evergreen"
	"github.com/stretchr/testify/assert"
)

func TestLoadUserManager(t *testing.T) {
	l := evergreen.LDAPConfig{
		URL:                "url",
		Port:               "port",
		UserPath:           "path",
		ServicePath:        "bot",
		Group:              "group",
		ExpireAfterMinutes: "60",
	}
	g := evergreen.GithubAuthConfig{
		ClientId:     "client_id",
		ClientSecret: "client_secret",
	}
	n := evergreen.NaiveAuthConfig{}
	o := evergreen.OktaConfig{
		ClientID:     "client_id",
		ClientSecret: "client_secret",
		Issuer:       "issuer",
		UserGroup:    "user_group",
	}

	a := evergreen.AuthConfig{}
	um, info, err := LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.Error(t, err, "a UserManager should not be able to be created in an empty AuthConfig")
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.Nil(t, um, "a UserManager should not be able to be created in an empty AuthConfig")

	a = evergreen.AuthConfig{Github: &g}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err, "a UserManager should be able to be created if one AuthConfig type is Github")
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.NotNil(t, um, "a UserManager should be able to be created if one AuthConfig type is Github")

	a = evergreen.AuthConfig{LDAP: &l}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err, "a UserManager should be able to be created if one AuthConfig type is LDAP")
	assert.True(t, info.CanClearTokens)
	assert.True(t, info.CanReauthorize)
	assert.NotNil(t, um, "a UserManager should be able to be created if one AuthConfig type is LDAP")

	a = evergreen.AuthConfig{Okta: &o}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err, "a UserManager should be able to be created if one AuthConfig type is Okta")
	assert.True(t, info.CanClearTokens)
	assert.True(t, info.CanReauthorize)
	assert.NotNil(t, um, "a UserManager should be able to be created if one AuthConfig type is Okta")

	a = evergreen.AuthConfig{Naive: &n}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err, "a UserManager should be able to be created if one AuthConfig type is Naive")
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.NotNil(t, um, "a UserManager should be able to be created if one AuthConfig type is Naive")

	a = evergreen.AuthConfig{PreferredType: evergreen.AuthLDAPKey, LDAP: &l}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err)
	assert.True(t, info.CanClearTokens)
	assert.True(t, info.CanReauthorize)
	assert.NotNil(t, um)

	a = evergreen.AuthConfig{PreferredType: evergreen.AuthOktaKey, Okta: &o}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err)
	assert.True(t, info.CanClearTokens)
	assert.True(t, info.CanReauthorize)
	assert.NotNil(t, um)

	a = evergreen.AuthConfig{PreferredType: evergreen.AuthGithubKey, Github: &g}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err)
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.NotNil(t, um)
	_, ok := um.(*GithubUserManager)
	assert.True(t, ok)

	a = evergreen.AuthConfig{PreferredType: evergreen.AuthNaiveKey, Naive: &n}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err)
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.NotNil(t, um)

	a = evergreen.AuthConfig{PreferredType: evergreen.AuthGithubKey, LDAP: &l, Github: &g, Naive: &n}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err)
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.NotNil(t, um)
	_, ok = um.(*GithubUserManager)
	assert.True(t, ok)

	a = evergreen.AuthConfig{PreferredType: evergreen.AuthGithubKey, Naive: &n}
	um, info, err = LoadUserManager(&evergreen.Settings{AuthConfig: a})
	assert.NoError(t, err)
	assert.False(t, info.CanClearTokens)
	assert.False(t, info.CanReauthorize)
	assert.NotNil(t, um)
	_, ok = um.(*NaiveUserManager)
	assert.True(t, ok)
}
