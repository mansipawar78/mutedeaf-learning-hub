import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type LessonProgress = {
    lessonId : Text;
    started : Bool;
    completed : Bool;
    score : Nat;
  };

  type SessionKey = Text;

  let emptyLessonProgress : LessonProgress = {
    lessonId = "";
    started = false;
    completed = false;
    score = 0;
  };

  module LessonProgress {
    public func compareByScore(p1 : LessonProgress, p2 : LessonProgress) : Order.Order {
      Nat.compare(p1.score, p2.score);
    };
  };

  let users = Map.empty<SessionKey, Map.Map<Text, LessonProgress>>();

  public shared ({ caller }) func startLesson(session : SessionKey, lessonId : Text) : async () {
    let userProgressMap = switch (users.get(session)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Text, LessonProgress>();
        users.add(session, newMap);
        newMap;
      };
    };

    switch (userProgressMap.get(lessonId)) {
      case (null) {
        let progress = emptyLessonProgress : LessonProgress;
        userProgressMap.add(lessonId, progress);
      };
      case (?_) { Runtime.trap("Lesson already started.") };
    };
  };

  public shared ({ caller }) func completeLesson(session : SessionKey, lessonId : Text) : async () {
    switch (users.get(session)) {
      case (?userProgressMap) {
        switch (userProgressMap.get(lessonId)) {
          case (null) { Runtime.trap("Lesson not started yet.") };
          case (?progress) {
            let completed = {
              progress with
              completed = true;
            };
            userProgressMap.add(lessonId, completed);
          };
        };
      };
      case (null) { Runtime.trap("No progress found for this session") };
    };
  };

  public shared ({ caller }) func updateScore(session : SessionKey, lessonId : Text, score : Nat) : async () {
    switch (users.get(session)) {
      case (?userProgressMap) {
        switch (userProgressMap.get(lessonId)) {
          case (null) { Runtime.trap("Lesson progress not found.") };
          case (?progress) {
            let updated = {
              progress with
              score = Nat.max(progress.score, score);
            };
            userProgressMap.add(lessonId, updated);
          };
        };
      };
      case (null) { Runtime.trap("No progress found for this session") };
    };
  };

  public query ({ caller }) func getLessonProgress(session : SessionKey, lessonId : Text) : async LessonProgress {
    switch (users.get(session)) {
      case (?userProgressMap) {
        switch (userProgressMap.get(lessonId)) {
          case (?progress) { progress };
          case (null) { Runtime.trap("Lesson progress not found") };
        };
      };
      case (null) { Runtime.trap("No progress found for this session") };
    };
  };

  public query ({ caller }) func isStarted(session : SessionKey, lessonId : Text) : async Bool {
    switch (users.get(session)) {
      case (?userProgressMap) { switch (userProgressMap.get(lessonId)) {
        case (null) { false };
        case (?progress) { progress.started };
      } };
      case (null) { false };
    };
  };

  public query ({ caller }) func isCompleted(session : SessionKey, lessonId : Text) : async Bool {
    switch (users.get(session)) {
      case (?userProgressMap) { switch (userProgressMap.get(lessonId)) {
        case (null) { false };
        case (?progress) { progress.completed };
      } };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAllProgress(session : SessionKey) : async [LessonProgress] {
    switch (users.get(session)) {
      case (?userProgressMap) { userProgressMap.values().toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllProgressSortedByScore(session : SessionKey) : async [LessonProgress] {
    switch (users.get(session)) {
      case (?userProgressMap) { userProgressMap.values().toArray().sort(LessonProgress.compareByScore) };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func resetProgress(session : SessionKey) : async () {
    switch (users.get(session)) {
      case (?_) {
        let newProgressMap = Map.empty<Text, LessonProgress>();
        users.add(session, newProgressMap);
      };
      case (null) { Runtime.trap("No progress found for this session") };
    };
  };
};
