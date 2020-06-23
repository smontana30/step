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
        int duration = (int)request.getDuration();
        List<TimeRange> ranges = new ArrayList<TimeRange>();
        int timeRange = 0;
        int timePlus = 0;
        for(int i = 0; i < timeRangesArray.size(); i++) {
            timeRange = (int)timeRangesArray.get(i);
            // if there are duplicates remove those instances 
            if (i == 0) {  
                // skip if curr time = Start of Day (0)
                if (timeRange == TimeRange.START_OF_DAY) {
                    continue;
                }
                ranges.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, timeRange, false));
            }
            else if (i == (timeRangesArray.size() - 1)) {
                // skip if curr time = End of Day (1440)
                if (timeRange == (TimeRange.END_OF_DAY + 1)) {
                    break;
                }
                ranges.add(TimeRange.fromStartEnd(timeRange, TimeRange.END_OF_DAY, true));
            }
            else {
                timePlus = (int)timeRangesArray.get(++i);
                // checks for duplicate times if we have duplicates just skip
                if (timeRange == timePlus) {
                    continue;
                }
                ranges.add(TimeRange.fromStartEnd(timeRange, timePlus, false));                
            }
        }
        for(int i = 0; i < ranges.size(); i++) {
            // checks to see if there if enough room in the day for each meeting if not remove it
            if (ranges.get(i).duration() < request.getDuration()) {
                ranges.remove(i);
            }
        }
        return ranges;
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
        ArrayList<Integer>  startEndTimes = new ArrayList<Integer>();
        int start = 0;
        int end = 0;
        int startTimePrev = 0;
        int endTimePrev = 0;
        int index = 0;
        for (Event event : events) {            
            start= event.getWhen().start();
            end  = event.getWhen().end();
            if (event.getAttendees().stream().anyMatch(request.getAttendees()::contains)) {
                if (event.getWhen().start() < endTimePrev && event.getWhen().start() > startTimePrev) {
                    if (event.getWhen().end() > endTimePrev) {
                        
                        if (startEndTimes.contains(endTimePrev)) {
                            startEndTimes.set(index, end);
                        }
                    }
                    else if (endTimePrev > event.getWhen().end()) {
                        index += 1;
                        startTimePrev = start;
                        endTimePrev = end;
                        continue;
                    }
                }
                else {
                    startEndTimes.add(start);
                    startEndTimes.add(end);
                }
                
            }
            // same functionally for optional attendees
            if (event.getAttendees().stream().anyMatch(request.getOptionalAttendees()::contains)) {
                if (event.getWhen().equals(TimeRange.WHOLE_DAY)) {
                    // if optional user has all day event just skip them
                    index += 1;
                    startTimePrev = start;
                    endTimePrev = end;
                    continue;
                }
                if (event.getWhen().start() < endTimePrev && event.getWhen().start() > startTimePrev) {
                    if (event.getWhen().end() > endTimePrev) {
                        // if passes both test there is definity an overlap then push starttime for 1 and end time for 2 to get correct meeting times
                        if (startEndTimes.contains(endTimePrev)) {
                            startEndTimes.set(index, end);
                        }
                    }
                    else if (endTimePrev > event.getWhen().end()) {
                        // nested overlap do nothing update Prevs and index
                        index += 1;
                        startTimePrev = start;
                        endTimePrev = end;
                        continue;
                    }
                }
                else {
                    // no weird overlap or nesting case happened so add as normal
                    startEndTimes.add(start);
                    startEndTimes.add(end);
                }
            }
            index += 1;
            startTimePrev = start;
            endTimePrev = end;
        }
        Collections.sort(startEndTimes);
        if (startEndTimes.isEmpty()) {
            return Arrays.asList(TimeRange.WHOLE_DAY);
        }
        avaiablity = findRange(startEndTimes, request, events);
        return avaiablity;
    }
}
