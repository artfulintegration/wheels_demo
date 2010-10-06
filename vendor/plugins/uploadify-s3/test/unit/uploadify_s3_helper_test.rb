require 'test_helper'

class UploadifyS3HelperTest < ActionView::TestCase
  include UploadifyS3Helper
  
  def test_default_bucket_url
    assert_equal "http://YOUR_BUCKET_NAME.s3.amazonaws.com/", bucket_url
  end

  def test_default_key
    assert_equal "uploads/${filename}", key
  end

  def test_s3_signature
    assert_not_nil s3_signature
  end    
end