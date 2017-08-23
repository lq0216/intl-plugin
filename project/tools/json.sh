#!/bin/bash

branch_id=$1
repo=$2
build_id=$3
pipeline_id=$4
source_root=$5
emp_id=$6
teelog=$7
commit_id=$8
stage_id=$9

printf "{\n"
printf '\t"data":[\n'

printf '\t\t{'
printf "\"branch_id\":\"${branch_id}\"},\n"

printf '\t\t{'
printf "\"repo\":\"${repo}\"},\n"

printf '\t\t{'
printf "\"build_id\":\"${build_id}\"},\n"

printf '\t\t{'
printf "\"pipeline_id\":\"${pipeline_id}\"},\n"

printf '\t\t{'
printf "\"emp_id\":\"${emp_id}\"},\n"

printf '\t\t{'
printf "\"teelog\":\"${teelog}\"},\n"

printf '\t\t{'
printf "\"commit_id\":\"${commit_id}\"},\n"

printf '\t\t{'
printf "\"stage_id\":\"${stage_id}\"}\n"

printf "\t]\n"
printf "}\n"
