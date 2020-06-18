// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Iterator;

public final class FindMeetingQuery {

    public List<TimeRange> findRange( ArrayList timeRangesArray, MeetingRequest request, Collection<Event> event){
        // going to find end time and export arraylist with start and end time
        int duration = (int)request.getDuration();
        System.out.println("in the findRange method()");
        List<TimeRange> rangezz = new ArrayList<TimeRange>();
        int timeRange = 0;
        int timePlus = 0;
        for(int i = 0; i < timeRangesArray.size(); i++) {
            timeRange = (int)timeRangesArray.get(i);
            if (i == 0) {   
                if (timeRange == TimeRange.START_OF_DAY) {
                    continue;
                }
                rangezz.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, timeRange, false));
            }
            else if (i == (timeRangesArray.size() - 1)) {
                if (timeRange == (TimeRange.END_OF_DAY + 1)) {
                    break;
                }
                rangezz.add(TimeRange.fromStartEnd(timeRange, TimeRange.END_OF_DAY, true));
            }
            else {
                timePlus = (int)timeRangesArray.get(++i);
                rangezz.add(TimeRange.fromStartEnd(timeRange, timePlus, false));                
            }
        }
        for(int i = 0; i < rangezz.size(); i++) {
            if (rangezz.get(i).duration() < request.getDuration()) {
                rangezz.remove(i);
            }
        }
        return rangezz;
    }

    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
                return Arrays.asList();
            }
        if (events.isEmpty()) {
            return Arrays.asList(TimeRange.WHOLE_DAY);
        }
        int eventCount = 0;
        List<TimeRange> avaiablity = new ArrayList<TimeRange>();
        ArrayList<Integer> eventTimes = new ArrayList<Integer>();
        ArrayList<Integer>  startEndTimes = new ArrayList<Integer>();
        Collection<String> eventAttendees = events.getAttendees();
        Collection<String> requestAttendees = request.getAttendees();
        int start = 0;
        int end = 0;
        int startTimePrev = 0;
        int endTimePrev = 0;
        int index = 0;
        for (Event e : events) {
            System.out.println(e.getWhen().toString() + " current index is " + index);
            // first do comparison
            // may need to export eventmeetings.get.start to int variable might cause some type errors in java
            // overlap test
            // start = 0 or end = 1440(end of day) just don't add to array skip them
            start= e.getWhen().start();
            end  = e.getWhen().end();
            System.out.println("start = " + start + " startPrev = " + startTimePrev);
            System.out.println("end = " + end + " endPrev = " + endTimePrev);
            if ((e.getAttendees().contains(request.getOptionalAttendees()))) {
                // don't add at event to starttimeEnd time array
                
                startTimePrev = start;
                endTimePrev = end;
                continue;
            }
            // if (e.getAttendees().contains(request.getAttendees())) {
                System.out.println("attendee for event is here");
                if (e.getWhen().start() < endTimePrev) {
                    if (e.getWhen().end() > endTimePrev) {
                        // if passes both test there is definity an overlap then push starttime for 1 and end time for 2 to get correct meeting times
                        System.out.println("Overlap");
                        // iteration val already in so check for one we want to delete and if inside delete and add end time 
                        if (startEndTimes.contains(endTimePrev)) {
                            startEndTimes.set(index, end);
                        }
                    }
                    else if (endTimePrev > e.getWhen().end()) {
                        // nested test
                        // if true just push prev start and end
                        System.out.println("Nested Overlap");
                        // if nest just don't add new end adn start to array
                        index += 1;
                        startTimePrev = start;
                        endTimePrev = end;
                        continue;
                    }
                }
                else {
                    // if start = Start_Of_Day just add end tiem of that sequence 
                    startEndTimes.add(start);
                    startEndTimes.add(end);
                }
            // }
            index += 1;
            startTimePrev = start;
            endTimePrev = end;
        }
        for (int i = 0; i < startEndTimes.size(); i++) {
            System.out.println("index = " + i);
            System.out.println("time is " + startEndTimes.get(i));
        }
        if (startEndTimes.isEmpty()) {
            return Arrays.asList(TimeRange.WHOLE_DAY);
        }
        avaiablity = findRange(startEndTimes, request, events);
        return avaiablity;
    }
}
