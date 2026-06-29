export type Lang = 'en' | 'vi';

export interface Translations {
  // Welcome overlay
  theWeddingOf: string;
  dearGuest: string;
  openInvitation: string;
  cordiallyInvites: string;

  // Home
  weddingInvitation: string;
  scrollDown: string;

  // Bride / Marriage
  weddingCeremony: string;
  matchMadeInHeaven: string;
  coupleStory: string;
  groom: string;
  bride: string;
  father: string;
  mother: string;

  // Love Idiom
  idiom1: string;
  idiom2: string;

  // Love Story
  readOurStory: string;
  loveStory: [string, string][];

  // Wedding Date
  happyMoments: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  cordiallyInvited: string;
  weddingTime: string;
  dressCode: string;
  seeGoogleMaps: string;
  venueAddress: string;

  // Section titles
  loveIdiomTitle: string;
  loveStoryTitle: string;
  galleryTitle: string;
  loveGiftTitle: string;
  giftLabel: string;
  infoBtn: string;
  wishTitle: string;
  buildWith: string;

  // Love Gift
  loveGiftDesc: string;
  bankTransfer: string;

  // Comment section
  commentDisabled: string;
  shareInvitation: string;

  // End
  thankYouDesc: string;
  thankYouPresence: string;
  thankYou: string;

  // Navbar
  navHome: string;
  navMarriage: string;
  navDate: string;
  navGallery: string;
  navWish: string;

  // Comment form
  nameLabel: string;
  namePlaceholder: string;
  attendanceLabel: string;
  confirmAttendance: string;
  willAttend: string;
  wontAttend: string;
  commentLabel: string;
  commentPlaceholder: string;
  send: string;
  nameEmpty: string;
  attendanceEmpty: string;
  commentEmpty: string;

  // Comment card
  reply: string;
  edit: string;
  delete: string;
  hideReplies: string;
  showReplies: (n: number) => string;
  areYouSure: string;
  readMore: string;
  readLess: string;
  replyPlaceholder: string;
  cancel: string;
  attending: string;
  notAttending: string;
  updateCommentPlaceholder: string;
  update: string;
  prev: string;
  next: string;
}

export const translations: Record<Lang, Translations> = {
  en: {
    // Welcome overlay
    theWeddingOf: 'The Wedding Of',
    dearGuest: 'Dear',
    openInvitation: 'Open Invitation',
    cordiallyInvites: 'Cordially Invites',

    // Home
    weddingInvitation: 'Wedding Invitation',
    scrollDown: 'Scroll Down',

    // Bride / Marriage
    weddingCeremony: 'Wedding Ceremony',
    matchMadeInHeaven: 'Match made in heaven',
    coupleStory:
      'After a long journey writing our love story together, we have decided to step into a new chapter — the chapter called Marriage.',
    groom: 'Groom',
    bride: 'Bride',
    father: 'Father',
    mother: 'Mother',

    // Love Idiom
    idiom1: 'Two hearts beating as one, two lives walking the same path.',
    idiom2: 'Fate brings us together, but love keeps us close — happiness is ours to hold.',

    // Love Story
    readOurStory: 'Read our story',
    loveStory: [
      ['✨ First meeting', 'Where our story began.'],
      ['💞 Dating', 'Days spent making memories together.'],
      ['💥 Our arguments', 'We argued, then loved each other even more.'],
      ['💍 Proposal', 'And then we decided to build a home together.'],
    ],

    // Wedding Date
    happyMoments: 'Happy moments',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Mins',
    seconds: 'Secs',
    cordiallyInvited: 'You are cordially invited to celebrate our wedding at:',
    weddingTime: 'Saturday, 01.08.2026 at 11:00 AM',
    dressCode: 'We kindly ask guests to dress in matching colors to complement the ambiance:',
    seeGoogleMaps: 'See Google Maps',
    venueAddress: '3 Đặng Văn Sâm St., Đức Nhuận Ward, Ho Chi Minh City, Vietnam',

    // Section titles
    loveIdiomTitle: 'Love Idiom',
    loveStoryTitle: 'Love Story',
    galleryTitle: 'Gallery',
    loveGiftTitle: 'Love Gift',
    giftLabel: 'Gift',
    infoBtn: 'Info',
    wishTitle: 'Hello & Wish',
    buildWith: 'Build with',

    // Love Gift
    loveGiftDesc:
      'With all our gratitude, if you wish to send us a token of your love, please do so through:',
    bankTransfer: 'Bank Transfer',

    // Comment section
    commentDisabled: 'Comment feature is disabled.',
    shareInvitation: "📢 Share this invitation to receive more wishes! 🎉",

    // End
    thankYouDesc: 'Thank you so much for your love and warm wishes.',
    thankYouPresence: 'Your presence is our greatest honor and joy.',
    thankYou: 'With deepest gratitude',

    // Navbar
    navHome: 'Home',
    navMarriage: 'Marriage',
    navDate: 'Date',
    navGallery: 'Gallery',
    navWish: 'Wish',

    // Comment form
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    attendanceLabel: 'Attendance',
    confirmAttendance: 'Confirm your attendance',
    willAttend: '✅ Yes, I will be there!',
    wontAttend: "❌ Sorry, I can't make it",
    commentLabel: 'Comment',
    commentPlaceholder: 'Your wishes...',
    send: 'Send',
    nameEmpty: 'Name cannot be empty.',
    attendanceEmpty: 'Please select your attendance status.',
    commentEmpty: 'Comment cannot be empty.',

    // Comment card
    reply: 'Reply',
    edit: 'Edit',
    delete: 'Delete',
    hideReplies: 'Hide replies',
    showReplies: (n) => `Show replies (${n})`,
    areYouSure: 'Are you sure?',
    readMore: 'Read more',
    readLess: 'Read less',
    replyPlaceholder: 'Type your reply...',
    cancel: 'Cancel',
    attending: '✅ Attending',
    notAttending: '❌ Not attending',
    updateCommentPlaceholder: 'Update your message...',
    update: 'Update',
    prev: 'Prev',
    next: 'Next',
  },

  vi: {
    // Welcome overlay
    theWeddingOf: 'Lễ Cưới Của',
    dearGuest: 'Kính gửi',
    openInvitation: 'Mở Thiệp',
    cordiallyInvites: 'Trân Trọng Kính Mời',

    // Home
    weddingInvitation: 'Thiệp Mời Cưới',
    scrollDown: 'Cuộn Xuống',

    // Bride / Marriage
    weddingCeremony: 'Lễ Thành Hôn',
    matchMadeInHeaven: 'Được trời xe duyên',
    coupleStory:
      'Sau hành trình dài cùng nhau viết nên câu chuyện tình yêu, chúng tôi quyết định bước sang chương mới — chương mang tên Hôn Nhân.',
    groom: 'Quý nam',
    bride: 'Trưởng nữ',
    father: 'Cha',
    mother: 'Mẹ',

    // Love Idiom
    idiom1: 'Hai trái tim chung một nhịp, hai cuộc đời chung một lối.',
    idiom2: 'Duyên do trời định, phận do người tạo – hạnh phúc do đôi ta nắm giữ.',

    // Love Story
    readOurStory: 'Lắng nghe câu chuyện',
    loveStory: [
      ['✨ Lần gặp đầu tiên', 'Nơi bắt đầu câu chuyện của chúng mình.'],
      ['💞 Hẹn hò', 'Những ngày tháng cùng nhau tạo nên kỷ niệm.'],
      ['💥 Những lần cãi nhau', 'Cãi nhau rồi lại thương nhau nhiều hơn.'],
      ['💍 Cầu hôn', 'Và rồi chúng mình quyết định về chung một nhà.'],
    ],

    // Wedding Date
    happyMoments: 'Đếm Ngược',
    days: 'Ngày',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây',
    cordiallyInvited: 'Trân trọng kính mời quý vị đến dự lễ thành hôn của chúng tôi tại:',
    weddingTime: 'Vào lúc 11:00 Thứ 7, 01.08.2026',
    dressCode:
      'Mong quý khách ưu tiên trang phục cùng tông màu để hòa hợp không gian buổi tiệc:',
    seeGoogleMaps: 'Xem Google Maps',
    venueAddress: '3 đường Đặng Văn Sâm, phường Đức Nhuận, TP. Hồ Chí Minh, Việt Nam',

    // Section titles
    loveIdiomTitle: 'Lời Yêu Thương',
    loveStoryTitle: 'Câu Chuyện Tình',
    galleryTitle: 'Bộ Ảnh',
    loveGiftTitle: 'Quà Tặng Yêu Thương',
    giftLabel: 'Quà tặng',
    infoBtn: 'Thông tin',
    wishTitle: 'Lời Chúc Mừng',
    buildWith: 'Được tạo bởi',

    // Love Gift
    loveGiftDesc:
      'Với tất cả sự trân trọng, nếu quý khách muốn gửi tặng chúng tôi chút tấm lòng, xin vui lòng thông qua:',
    bankTransfer: 'Chuyển khoản',

    // Comment section
    commentDisabled: 'Tính năng bình luận bị tắt.',
    shareInvitation: '📢 Chia sẻ thiệp mời để nhận thêm lời chúc! 🎉',

    // End
    thankYouDesc: 'Xin cảm ơn sự quan tâm và lời chúc phúc của quý khách.',
    thankYouPresence: 'Sự hiện diện của quý khách là niềm vinh dự và hạnh phúc của gia đình chúng tôi.',
    thankYou: 'Trân trọng cảm ơn',

    // Navbar
    navHome: 'Trang chủ',
    navMarriage: 'Đôi Bạn',
    navDate: 'Ngày Cưới',
    navGallery: 'Ảnh',
    navWish: 'Chúc',

    // Comment form
    nameLabel: 'Tên',
    namePlaceholder: 'Nguyễn Văn A',
    attendanceLabel: 'Tham dự',
    confirmAttendance: 'Xác nhận tham dự',
    willAttend: '✅ Có, mình sẽ đến!',
    wontAttend: '❌ Bận mất rồi',
    commentLabel: 'Lời chúc',
    commentPlaceholder: 'Lời chúc của bạn...',
    send: 'Gửi',
    nameEmpty: 'Vui lòng nhập tên.',
    attendanceEmpty: 'Vui lòng xác nhận tham dự.',
    commentEmpty: 'Vui lòng nhập lời chúc.',

    // Comment card
    reply: 'Trả lời',
    edit: 'Sửa',
    delete: 'Xóa',
    hideReplies: 'Ẩn phản hồi',
    showReplies: (n) => `Xem phản hồi (${n})`,
    areYouSure: 'Bạn có chắc không?',
    readMore: 'Xem thêm',
    readLess: 'Rút gọn',
    replyPlaceholder: 'Nhập phản hồi...',
    cancel: 'Huỷ',
    attending: '✅ Tham dự',
    notAttending: '❌ Bận rồi',
    updateCommentPlaceholder: 'Cập nhật lời chúc...',
    update: 'Cập nhật',
    prev: 'Trước',
    next: 'Tiếp',
  },
};
