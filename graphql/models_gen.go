// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package graphql

import (
	"fmt"
	"io"
	"strconv"

	"github.com/evergreen-ci/evergreen/rest/model"
)

type GroupedFiles struct {
	TaskName *string          `json:"taskName"`
	Files    []*model.APIFile `json:"files"`
}

type GroupedProjects struct {
	Name     string                   `json:"name"`
	Projects []*model.UIProjectFields `json:"projects"`
}

type PatchDuration struct {
	Makespan  *string    `json:"makespan"`
	TimeTaken *string    `json:"timeTaken"`
	Time      *PatchTime `json:"time"`
}

type PatchTime struct {
	Started     *string `json:"started"`
	Finished    *string `json:"finished"`
	SubmittedAt string  `json:"submittedAt"`
}

type Projects struct {
	Favorites     []*model.UIProjectFields `json:"favorites"`
	OtherProjects []*GroupedProjects       `json:"otherProjects"`
}

type SortDirection string

const (
	SortDirectionAsc  SortDirection = "ASC"
	SortDirectionDesc SortDirection = "DESC"
)

var AllSortDirection = []SortDirection{
	SortDirectionAsc,
	SortDirectionDesc,
}

func (e SortDirection) IsValid() bool {
	switch e {
	case SortDirectionAsc, SortDirectionDesc:
		return true
	}
	return false
}

func (e SortDirection) String() string {
	return string(e)
}

func (e *SortDirection) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = SortDirection(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid SortDirection", str)
	}
	return nil
}

func (e SortDirection) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type TaskSortCategory string

const (
	TaskSortCategoryStatus   TaskSortCategory = "STATUS"
	TaskSortCategoryDuration TaskSortCategory = "DURATION"
	TaskSortCategoryTestName TaskSortCategory = "TEST_NAME"
)

var AllTaskSortCategory = []TaskSortCategory{
	TaskSortCategoryStatus,
	TaskSortCategoryDuration,
	TaskSortCategoryTestName,
}

func (e TaskSortCategory) IsValid() bool {
	switch e {
	case TaskSortCategoryStatus, TaskSortCategoryDuration, TaskSortCategoryTestName:
		return true
	}
	return false
}

func (e TaskSortCategory) String() string {
	return string(e)
}

func (e *TaskSortCategory) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = TaskSortCategory(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid TaskSortCategory", str)
	}
	return nil
}

func (e TaskSortCategory) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
